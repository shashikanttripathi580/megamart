import { Schema, model, Document, Model } from 'mongoose';
import { AddressSchema, IAddress } from './address.schema.js';
import { USER_ROLES, UserRole, USER_ROLES_LIST } from '../constants/roles.js';

export interface IUser {
  name: string;
  email?: string;
  phone: string;
  passwordHash?: string;
  role: UserRole;
  addresses: IAddress[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true, // Allows null/undefined for guests or users registered via phone
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9+ -]{10,15}$/, 'Please provide a valid phone number'],
    },
    passwordHash: {
      type: String,
      select: false, // Prevents leaking password hash in general queries
    },
    role: {
      type: String,
      enum: USER_ROLES_LIST,
      default: USER_ROLES.CUSTOMER,
      index: true,
    },
    addresses: {
      type: [AddressSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound and sparse indexes
UserSchema.index({ email: 1 }, { unique: true, sparse: true });
UserSchema.index({ phone: 1 });

export const User: Model<IUserDocument> = model<IUserDocument>('User', UserSchema);
