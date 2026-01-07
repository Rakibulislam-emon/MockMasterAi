import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for User document
export interface IUser extends Document {
  clerkId: string;
  email: string;
  name: string | null;
  preferredLanguage: 'en' | 'bn' | 'both';
  targetRole: string | null;
  targetIndustry: string | null;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive' | null;
  timezone: string;
  onboardingCompleted: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  updatedAt: Date;
}

// Interface for User model with static methods
export interface IUserModel extends Model<IUser> {
  findOrCreate(clerkId: string, email: string, name: string | null): Promise<IUser>;
  findByClerkId(clerkId: string): Promise<IUser | null>;
  updatePreferences(clerkId: string, updates: Partial<IUser>): Promise<IUser | null>;
}

// User schema definition
const UserSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: null,
    },
    preferredLanguage: {
      type: String,
      enum: ['en', 'bn', 'both'],
      default: 'en',
    },
    targetRole: {
      type: String,
      default: null,
    },
    targetIndustry: {
      type: String,
      default: null,
    },
    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'executive', null],
      default: null,
    },
    timezone: {
      type: String,
      default: 'Asia/Dhaka',
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });

// Pre-save middleware to update timestamps
UserSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Get or create user by Clerk ID
UserSchema.statics.findOrCreate = async function (
  clerkId: string,
  email: string,
  name: string | null
): Promise<IUser> {
  let user = await this.findOne({ clerkId });
  
  if (!user) {
    user = await this.create({
      clerkId,
      email,
      name,
      lastLoginAt: new Date(),
    });
  } else {
    user.lastLoginAt = new Date();
    await user.save();
  }
  
  return user;
};

// Find user by Clerk ID
UserSchema.statics.findByClerkId = async function (
  clerkId: string
): Promise<IUser | null> {
  return this.findOne({ clerkId });
};

// Update user preferences
UserSchema.statics.updatePreferences = async function (
  clerkId: string,
  updates: Partial<IUser>
): Promise<IUser | null> {
  return this.findOneAndUpdate(
    { clerkId },
    { $set: updates },
    { new: true }
  );
};

const User: IUserModel =
  (mongoose.models.User as IUserModel) || mongoose.model<IUser, IUserModel>('User', UserSchema);

export default User;
