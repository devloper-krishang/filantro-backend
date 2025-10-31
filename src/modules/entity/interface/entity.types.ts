export type CreateEntityInput = {
  name: string;
  slug: string;
  entityType:
    | 'academia'
    | 'business'
    | 'government'
    | 'grantmaker'
    | 'funder'
    | 'intermediary'
    | 'nonprofit';
  description?: string;
  website?: string;
  contactEmail?: string;
  country?: string;
  region?: string;
  city?: string;
};

export type UpdateEntityInput = Partial<CreateEntityInput>;

export type ClaimEntityInput = {
  entityId: string;
  message?: string;
};

export interface UpdateOnboardingParams {
  currentStepIndex: number;
  stepKey?: string;
  data: Record<string, any>;
  status?: 'not_started' | 'in_progress' | 'completed';
  userId?: string;
}
