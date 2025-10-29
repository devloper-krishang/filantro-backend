import { Request, Response } from 'express';
import { HTTP_STATUS } from '@/constants';
import { getEntityOnboarding, updateEntityOnboarding } from '../service/entity.service';
import { sendError, sendSuccess } from '@/utils';


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

    const updated = await updateEntityOnboarding(id, { currentStepIndex, stepKey, data, status, userId });

    return sendSuccess(res, 'Onboarding step updated successfully', updated);
  } catch (err: any) {
    console.error('Update Onboarding Error:', err);
    return sendError(res, HTTP_STATUS.INTERNAL_ERROR, 'Failed to update onboarding');
  }
};
