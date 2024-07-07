import dotenv from 'dotenv';
dotenv.config({ path: `${process.cwd()}/.env` });

import user from "../db/models/user.js";
import organization from "../db/models/organization.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // Assuming bcrypt instead of bycrypt
import  catchAsync  from "../util/catchAsync.js";
import AppError  from "../util/appError.js";
import sequelize from "../config/database.js";
import userorganization from "../db/models/userorganization.js";
import { generateToken } from '../util/generateToken.js';

export const register = catchAsync(async (req, res, next) => {
  const body = req.body;

  // Start a transaction
  const result = await sequelize.transaction(async (t) => {
    // Create a new user
    const newUser = await user.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
      phone: body.phone,
    }, { transaction: t });

    // Create a new organization
    const organizationName = `${newUser.firstName}'s Organization`;
    const newOrganization = await organization.create({
      name: organizationName,
      description: `This is ${organizationName} organization`,
      createdBy: newUser.userId
    }, { transaction: t });

    // Create the association manually
    await userorganization.create({
      userId: newUser.userId,
      orgId: newOrganization.orgId
    }, { transaction: t });

    return newUser;
  });

  if (!result) {
    return next(new AppError("Registration unsuccessful", 400));
  }

  const userJson = result.toJSON();
  const accessToken = generateToken({ id: userJson.userId });

  // Remove sensitive information
  delete userJson.password;
  delete userJson.deletedAt;
  delete userJson.createdAt;
  delete userJson.updatedAt;

  return res.status(201).json({
    status: "success",
    message: "Registration successful",
    data: {
      accessToken,
      user: userJson,
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("invalid email or password", 400));
  }

  const result = await user.findOne({ where: { email } });
  const isPasswordMatch = await bcrypt.compare(password, result.password);

  if (!result || !isPasswordMatch) {
    return next(new AppError("Authentication Failed", 401));
  }

  const accessToken = generateToken({ id: result.userId });

  delete result.id;
  delete result.password;
  delete result.deletedAt;
  delete result.createdAt;
  delete result.updatedAt;

  return res.status(200).json({
    status: "success",
    message: "Login successful",
    data: {
      accessToken,
      user: result,
    },
  });
});

export const authentication = catchAsync(async (req, res, next) => {
  let idToken = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    idToken = req.headers.authorization.split(" ")[1];
    if (!idToken) {
      return next(new AppError("unathorized", 401));
    }
  }

  const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);

  const freshUser = await user.findByPk(tokenDetail.id);
  if (!freshUser) {
    return next(new AppError("user no longer exits", 400));
  }
  req.user = freshUser;
  console.log(`from auth ${req.user.userId}`);
  return next();
});

