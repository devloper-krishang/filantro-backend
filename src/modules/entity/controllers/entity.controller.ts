import { Request, Response } from 'express';
import * as EntityService from '../service/entity.service';
import { sendSuccess } from '../../../utils/apis/responseHandler';
import { catchAsync } from '../../../utils/catchAsync';
import { HTTP_STATUS, RESPONSE_TAGS } from '../../../constants';

export const createEntity = catchAsync(async (req: Request, res: Response) => {
  const created = await EntityService.createEntityService(req.body, (req as any).user?.id);
  sendSuccess(res, 'Entity created', created, HTTP_STATUS.CREATED, RESPONSE_TAGS.CREATED);
});

export const updateEntity = catchAsync(async (req: Request, res: Response) => {
  const updated = await EntityService.updateEntityService(req.params.id, req.body);
  sendSuccess(res, 'Entity updated', updated, HTTP_STATUS.OK, RESPONSE_TAGS.UPDATED);
});

export const getEntity = catchAsync(async (req: Request, res: Response) => {
  const entity = await EntityService.getEntityService(req.params.id);
  sendSuccess(res, 'Entity fetched', entity, HTTP_STATUS.OK, RESPONSE_TAGS.FETCHED);
});

export const claimEntity = catchAsync(async (req: Request, res: Response) => {
  const result = await EntityService.claimEntityService((req as any).user?.id, req.body);
  sendSuccess(res, 'Claim processed', result, HTTP_STATUS.OK, RESPONSE_TAGS.UPDATED);
});
