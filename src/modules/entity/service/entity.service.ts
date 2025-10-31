import { Types } from 'mongoose';
import { Entity } from '../model/entity.model';
import { User } from '@/modules/user';
import { UpdateOnboardingParams } from '../interface/entity.types';
import cloudinary from '@/config/cloudinary';


export const handleEntityAssignment = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  if (!user.entityName || !user.entityType) {
    throw new Error('User registration data incomplete');
  }

  let entity = await Entity.findOne({
    name: user.entityName.trim(),
    type: user.entityType,
  });

  if (!entity) {
    entity = await Entity.create({
      name: user.entityName.trim(),
      type: user.entityType,
      onboarding: {
        flowType:
          user.entityType === 'government'
            ? 'government'
            : user.entityType === 'intermediary'
              ? 'grantmaker_intermediary'
              : 'funder_intermediary_nonprofit',
        currentStepIndex: 0,
        steps: [],
        onboardingStatus: 'not_started',
        progressPercent: 0,
      },
    });

    await entity.save();
  }

  user.entityId = entity._id as Types.ObjectId;
  await user.save();

  return entity;
};

export const getEntityOnboarding = async (entityId: string) => {
  const entity = await Entity.findById(entityId);
  if (!entity) return null;
  return entity.onboarding;
};

export const updateEntityOnboarding = async (
  entityId: string,
  { currentStepIndex, stepKey, data, status, userId }: UpdateOnboardingParams
) => {
  const entity = await Entity.findById(entityId);
  if (!entity) throw new Error('Entity not found');

  const onboarding = entity.onboarding;
  if (!onboarding?.steps?.length) throw new Error('No onboarding steps initialized');

  const step =
    onboarding.steps.find((s) => s.key === stepKey) || onboarding.steps[currentStepIndex];
  if (!step) throw new Error('Invalid step reference');

  step.data = { ...step.data, ...data };
  if (status) step.status = status;
  step.lastUpdatedAt = new Date();
  step.lastUpdatedBy = userId ? new Types.ObjectId(userId) : undefined;

  const total = onboarding.steps.length;
  const completed = onboarding.steps.filter((s) => s.status === 'completed').length;
  onboarding.progressPercent = Math.round((completed / total) * 100);
  onboarding.onboardingStatus =
    completed === total ? 'completed' : completed > 0 ? 'in_progress' : 'not_started';

  onboarding.currentStepIndex = currentStepIndex;
  onboarding.lastActivityAt = new Date();

  await entity.save();
  return onboarding;
};

export const uploadEntityImageService = async (entityId: string, fileBuffer: Buffer) => {
  const uploadResult: any = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: 'entities' }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(fileBuffer);
  });

  const { secure_url, public_id } = uploadResult;

  const updatedEntity = await Entity.findByIdAndUpdate(
    entityId,
    { documentImage: secure_url },
    { new: true }
  );

  return {
    secure_url,
    public_id,
    updatedEntity,
  };
};
