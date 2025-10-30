import { Types } from 'mongoose';
import { Entity } from '../model/entity.model';
import { CreateEntityInput, UpdateEntityInput, ClaimEntityInput } from '../interface/entity.types';
import { ConflictError, NotFoundError, cleanObject } from '../../../utils';
import { ENTITY_GROUP_BY_TYPE } from '../utils/constants';

export async function createEntityService(input: CreateEntityInput, createdBy: string) {
  const existing = await Entity.findOne({ $or: [{ slug: input.slug }, { name: input.name }] });
  if (existing) throw new ConflictError('Entity with same name/slug already exists');
  const group = ENTITY_GROUP_BY_TYPE[input.entityType];
  const doc = await Entity.create({
    ...input,
    group,
    createdBy: new Types.ObjectId(createdBy),
  });
  return doc;
}

export async function updateEntityService(entityId: string, input: UpdateEntityInput) {
  const entity = await Entity.findById(entityId);
  if (!entity) throw new NotFoundError('Entity not found');
  Object.assign(entity, cleanObject(input));
  await entity.save();
  return entity;
}

export async function getEntityService(entityId: string) {
  const entity = await Entity.findById(entityId);
  if (!entity) throw new NotFoundError('Entity not found');
  return entity;
}

export async function claimEntityService(userId: string, input: ClaimEntityInput) {
  const entity = await Entity.findById(input.entityId);
  if (!entity) throw new NotFoundError('Entity not found');

  if (entity.isClaimed) {
    // Entity already claimed: add request for admin approval
    entity.claimRequests.push({
      userId: new Types.ObjectId(userId),
      status: 'pending',
      requestedAt: new Date(),
      notes: input.message,
    });
    await entity.save();
    return { flow: 'approval_request', entityId: entity.id };
  }

  // Not claimed: mark provisional claim and require documents
  entity.isClaimed = true;
  entity.claimedBy = new Types.ObjectId(userId);
  entity.admins.push(new Types.ObjectId(userId));
  await entity.save();
  return { flow: 'provisional_claim', entityId: entity.id };
}
