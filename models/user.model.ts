import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  phone: string;
  address: string[];
  roles: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  isGod: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  setPassword(password: string): Promise<void>;
  validPassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  isGod: {
    type: Boolean,
    required: false,
    default: false,
  },
  roles: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
  ],
  address: {
    type: [String],
  },
  resetPasswordToken: {
    type: String,
    select: false,
  },
  resetPasswordExpires: {
    type: Date,
    select: false,
  },
}, { timestamps: true });

UserSchema.methods.setPassword = async function (password: string) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(password, salt);
};
UserSchema.methods.validPassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

UserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    // bcrypt hash luôn bắt đầu bằng $2a$ hoặc $2b$
    if (!this.password.startsWith('$2')) {
      return next(
        new Error(
          'Password must be hashed using setPassword() before saving'
        )
      );
    }
  }
  next();
});


const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
