import { Schema, model, Document, Types } from 'mongoose';
import { MODEL_NAMES } from '../../../constants/models';
import { CLAIM_STATUSES, DOCUMENT_STATUSES, ENTITY_GROUPS, ENTITY_TYPES } from '../utils/constants';

export type EntityType = (typeof ENTITY_TYPES)[number];

export type EntityGroup = (typeof ENTITY_GROUPS)[number];

export type ClaimStatus = (typeof CLAIM_STATUSES)[number];
export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];

export interface IEntityDocumentMeta {
  type: string;
  url: string;
  uploadedBy: Types.ObjectId;
  uploadedAt: Date;
  status: DocumentStatus;
  notes?: string;
}

export interface IClaimRequest {
  userId: Types.ObjectId;
  status: ClaimStatus;
  requestedAt: Date;
  decidedAt?: Date;
  decidedBy?: Types.ObjectId;
  notes?: string;
}

export interface IEntity extends Document {
  name: string;
  slug: string;
  entityType: EntityType;
  group: EntityGroup;
  description?: string;
  website?: string;
  contactEmail?: string;
  country?: string;
  region?: string;
  city?: string;

  onboarding: { completed: boolean; step: number };
  isClaimed: boolean;
  claimedBy?: Types.ObjectId | null;
  claimRequests: IClaimRequest[];
  documents: IEntityDocumentMeta[];

  admins: Types.ObjectId[];
  members: Types.ObjectId[];
  createdBy: Types.ObjectId;

  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

const documentSchema = new Schema<IEntityDocumentMeta>(
  {
    type: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.USER, required: true },
    uploadedAt: { type: Date, default: () => new Date() },
    status: { type: String, enum: DOCUMENT_STATUSES as unknown as string[], default: 'pending' },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const claimRequestSchema = new Schema<IClaimRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.USER, required: true },
    status: { type: String, enum: CLAIM_STATUSES as unknown as string[], default: 'pending' },
    requestedAt: { type: Date, default: () => new Date() },
    decidedAt: { type: Date },
    decidedBy: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.USER },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const entitySchema = new Schema<IEntity>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    entityType: { type: String, required: true, enum: ENTITY_TYPES as unknown as string[] },
    group: { type: String, enum: ENTITY_GROUPS as unknown as string[], required: true },
    description: { type: String, trim: true },
    website: { type: String, trim: true },
    contactEmail: { type: String, trim: true, lowercase: true },
    country: { type: String, trim: true },
    region: { type: String, trim: true },
    city: { type: String, trim: true },

    onboarding: {
      completed: { type: Boolean, default: false },
      step: { type: Number, default: 0 },
    },
    isClaimed: { type: Boolean, default: false },
    claimedBy: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.USER, default: null },
    claimRequests: { type: [claimRequestSchema], default: [] },
    documents: { type: [documentSchema], default: [] },

    admins: [{ type: Schema.Types.ObjectId, ref: MODEL_NAMES.USER }],
    members: [{ type: Schema.Types.ObjectId, ref: MODEL_NAMES.USER }],
    createdBy: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.USER, required: true },

    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const Entity = model<IEntity>('Entity', entitySchema);
