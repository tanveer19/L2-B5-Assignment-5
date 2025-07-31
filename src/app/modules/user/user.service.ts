import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { Wallet } from "../wallet/wallet.model";

const createUser = async (payload: Partial<IUser>) => {
  const { phone, password, email, role, ...rest } = payload;

  if (!phone || !password || !role) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Phone, password, and role are required"
    );
  }

  // ✅ Only USER or AGENT allowed
  if (![Role.USER, Role.AGENT].includes(role)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only USER or AGENT role can register via API"
    );
  }

  const existingUser = await User.findOne({ phone });

  if (existingUser) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User with phone already exists"
    );
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email ? email : phone,
  };

  const user = await User.create({
    phone,
    role,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  // ✅ Create wallet and update user with wallet reference
  const wallet = await Wallet.create({ user: user._id });
  user.wallet = wallet._id;
  await user.save();

  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const ifUserExist = await User.findById(userId);

  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "you are not authorized");
    }
    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "you are not authorized");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "you are not authorized");
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

const getAllUsers = async () => {
  const users = await User.find({}).populate("wallet");

  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
};
