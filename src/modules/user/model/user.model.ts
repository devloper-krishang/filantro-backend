import { Schema, model, Document, Types } from 'mongoose';
import { MODEL_NAMES } from '../../../constants/models';

export interface IUser extends Document {
  name: string;
  lastname: string;
  entityName: string;
  jobTitle: string;
  telephone: string;
  email: string;
  password: string;
  entityType: string;
  isSuperAdmin: boolean;
  isEmailVerified?: boolean;
  status?: 'active' | 'inactive';
  entityId?: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    entityName: { type: String, required: true, trim: true },
    jobTitle: { type: String, required: true, trim: true },
    telephone: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    entityType: {
      type: String,
      required: true,
      enum: ['academia', 'business', 'government', 'grantmaker', 'intermediary', 'nonprofit'],
    },
    isSuperAdmin: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    entityId: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.ENTITY, default: null },
  },
  { timestamps: true }
);

export const User = model<IUser>(MODEL_NAMES.USER, userSchema);
