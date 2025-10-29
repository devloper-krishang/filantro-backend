import { Schema, model, Document, Types } from 'mongoose';
import { MODEL_NAMES } from '@/constants/models';

/**
 * ENTITY SCHEMA
 * - Represents an organization / institution (Grantmaker, Intermediary, Nonprofit, Government, etc.)
 * - Each entity can have multiple users linked via User.entityId
 * - Holds onboarding flow data and core organizational profile info
 */

export interface IEntity extends Document {
  name: string;
  type: 'grantmaker' | 'intermediary' | 'nonprofit' | 'government' | 'business' | 'academia';
  subtype?: string;
  annualGrantmakingPR?: number;
  impactAreas?: string[];
  documentImage: string;
  // Onboarding
  onboarding: {
    flowType: 'government' | 'grantmaker_intermediary' | 'funder_intermediary_nonprofit';
    currentStepIndex: number;
    steps: {
      key: string;
      title?: string;
      order: number;
      status: 'not_started' | 'in_progress' | 'completed';
      startedAt?: Date;
      completedAt?: Date;
      lastUpdatedAt?: Date;
      lastUpdatedBy?: Types.ObjectId;
      data?: Record<string, any>;
    }[];
    onboardingStatus: 'not_started' | 'in_progress' | 'completed';
    progressPercent: number;
    lastActivityAt?: Date;
  };

  // Profile fields (collected through onboarding)
  structure?: {
    operationalStructure?: string;
  };

  strategy?: {
    vision?: string;
    mission?: string;
  };

  financials?: {
    operatingBudget?: number;
    typeOfIncome?: {
      restricted?: number;
      unrestricted?: number;
    };
    incomeSources?: {
      source: string;
      percentage: number;
    }[];
  };

  humanResources?: {
    fullTimeEmployees?: string;
    externalServices?: string;
  };

  technology?: {
    automationLevel?: string;
    cybersecurityPolicies?: string;
    collaborationTools?: string[];
    digitalPlatforms?: string[];
  };

  government?: {
    subAgency?: string;
    program?: string;
  };

  // Timestamps and meta
  profileCompletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const entitySchema = new Schema<IEntity>(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ['grantmaker', 'intermediary', 'nonprofit', 'government', 'business', 'academia'],
    },
    subtype: { type: String },
    annualGrantmakingPR: { type: Number },
    impactAreas: [{ type: String }],
    documentImage: { type: String, required: false },
    onboarding: {
      flowType: {
        type: String,
        enum: ['government', 'grantmaker_intermediary', 'funder_intermediary_nonprofit'],
        required: true,
      },
      currentStepIndex: { type: Number, default: 0 },
      steps: [
        {
          key: { type: String, required: true },
          title: { type: String },
          order: { type: Number, required: true },
          status: {
            type: String,
            enum: ['not_started', 'in_progress', 'completed'],
            default: 'not_started',
          },
          startedAt: { type: Date },
          completedAt: { type: Date },
          lastUpdatedAt: { type: Date },
          lastUpdatedBy: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.USER },
          data: { type: Schema.Types.Mixed },
        },
      ],
      onboardingStatus: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed'],
        default: 'not_started',
      },
      progressPercent: { type: Number, default: 0 },
      lastActivityAt: { type: Date },
    },

    structure: {
      operationalStructure: { type: String },
    },

    strategy: {
      vision: { type: String, maxlength: 150 },
      mission: { type: String, maxlength: 150 },
    },

    financials: {
      operatingBudget: { type: Number },
      typeOfIncome: {
        restricted: { type: Number },
        unrestricted: { type: Number },
      },
      incomeSources: [
        {
          source: { type: String },
          percentage: { type: Number },
        },
      ],
    },

    humanResources: {
      fullTimeEmployees: { type: String },
      externalServices: { type: String },
    },

    technology: {
      automationLevel: { type: String },
      cybersecurityPolicies: { type: String },
      collaborationTools: [{ type: String }],
      digitalPlatforms: [{ type: String }],
    },

    government: {
      subAgency: { type: String },
      program: { type: String },
    },

    profileCompletedAt: { type: Date },
  },
  { timestamps: true }
);

/**
 * Virtual population:
 * - Fetch all users belonging to this entity using populate('users')
 */
entitySchema.virtual('users', {
  ref: MODEL_NAMES.USER,
  localField: '_id',
  foreignField: 'entityId',
});

export const Entity = model<IEntity>(MODEL_NAMES.ENTITY, entitySchema);
