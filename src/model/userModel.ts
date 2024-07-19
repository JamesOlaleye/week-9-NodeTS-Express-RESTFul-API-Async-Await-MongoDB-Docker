import { randomUUID } from 'crypto';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose'

export interface UserAttributes {
  fullName: string;
  email: string;
  gender: string;
  phone: string;
  address: string;
  password: string;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
  Notes: Array<{ types: mongoose.Schema.Types.ObjectId; ref: "Note" }>;
}

const userValidationSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  gender: Joi.string().required(),
  phone: Joi.string().required().pattern(/^\d{11}$/),
  address: Joi.string().required(),
  password: Joi.string().required().min(6),
  confirm_password: Joi.ref('password'),
});

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    gender: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
      unique: true,
    },
    address: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note',
      },
    ],
  },
  {
    timestamps: true,
  }
);


userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.pre<UserAttributes>('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error: any) {
    next(error);
  }
});

userSchema.pre("validate", async function (next) {
  try {
    const { fullName, email, gender, phone, address, password } = this;
    const validationResult = await userValidationSchema.validateAsync(
      {
        fullName,
        email,
        gender,
        phone,
        address,
        password
      },
      {
        abortEarly: false,
      }
    )
    this.set(validationResult);
    next();
  } catch (error: any) {
    next(error);
  }
}
)

const User = mongoose.model<UserAttributes>('User', userSchema)

export default User

