import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  password: string;
  email?: string;
  phone: string;
  address?: string[];
  roles: string[];
  isGod: boolean;
  createDate: Date;
  updateDate: Date;

  // Methods
  validPassword: (password: string) => Promise<boolean>;
  encryptPassword: (password: string) => Promise<string>;
  checkRoles: (role: string) => boolean;
  checkGod: () => boolean;
}

const UserSchema = new mongoose.Schema<IUser>({
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  isGod: {
    type: Boolean,
    required: true,
    default: false,
  },
  roles: {
    type: [String],
    default: [],
  },
  address: {
    type: [String],
    default: [],
  },
}, {
  timestamps: {
    createdAt: 'createDate',
    updatedAt: 'updateDate'
  }
});

UserSchema.methods.encryptPassword = async (password: string) => {
  return bcrypt.hash(password, bcrypt.genSaltSync(10));
};

UserSchema.methods.validPassword = async function(password: string) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.checkGod = function() {
  return this.isGod;
};

UserSchema.methods.checkRoles = function(role: string) {
  return this.roles.includes(role);
};

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model('User', UserSchema);

export default UserModel;