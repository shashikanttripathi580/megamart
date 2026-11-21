import { Schema } from 'mongoose';

export interface IAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  addressType: 'home' | 'work' | 'other';
  isDefault?: boolean;
}

export const AddressSchema = new Schema<IAddress>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required for delivery'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Contact phone number is required for delivery'],
      trim: true,
      match: [/^[0-9+ -]{10,15}$/, 'Please provide a valid phone number'],
    },
    addressLine1: {
      type: String,
      required: [true, 'Address Line 1 is required'],
      trim: true,
      maxlength: [200, 'Address Line 1 cannot exceed 200 characters'],
    },
    addressLine2: {
      type: String,
      trim: true,
      maxlength: [200, 'Address Line 2 cannot exceed 200 characters'],
    },
    landmark: {
      type: String,
      trim: true,
      maxlength: [150, 'Landmark cannot exceed 150 characters'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
      match: [/^[1-9][0-9]{5}$/, 'Please provide a valid 6-digit Indian PIN code'],
    },
    latitude: {
      type: Number,
      required: false,
    },
    longitude: {
      type: Number,
      required: false,
    },
    addressType: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false, // embedded subdocument schema
  }
);
