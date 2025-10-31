import { Request, Response } from 'express';
import * as EntityService from '../service/entity.service';
import { sendSuccess } from '../../../utils/apis/responseHandler';
import { catchAsync } from '../../../utils/catchAsync';
import { HTTP_STATUS, RESPONSE_TAGS } from '../../../constants';

export const getOnboarding = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const onboarding = await getEntityOnboarding(id);
    if (!onboarding) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, 'Entity onboarding not found');
    }

    return sendSuccess(res, 'Entity onboarding fetched successfully', onboarding);
  } catch (err: any) {
    console.error('Get Onboarding Error:', err);
    return sendError(res, HTTP_STATUS.INTERNAL_ERROR, 'Failed to fetch onboarding data');
  }
};

export const updateOnboarding = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { currentStepIndex, stepKey, data, status } = req.body;
    const userId = (req as any).user?._id;

    const updated = await updateEntityOnboarding(id, {
      currentStepIndex,
      stepKey,
      data,
      status,
      userId,
    });

    return sendSuccess(res, 'Onboarding step updated successfully', updated);
  } catch (err: any) {
    console.error('Update Onboarding Error:', err);
    return sendError(res, HTTP_STATUS.INTERNAL_ERROR, 'Failed to update onboarding');
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const entityId = req.params.id;

    const { secure_url, updatedEntity } = await uploadEntityImageService(entityId, req.file.buffer);

    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl: secure_url,
      entity: updatedEntity,
    });
  } catch (error: any) {
    console.error('Image upload failed:', error);
    res.status(500).json({
      message: 'Image upload failed',
      error: error.message,
    });
  }
};
