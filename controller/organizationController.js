
import { expect } from 'chai';
import { Sequelize } from "sequelize";
import organization from "../db/models/organization.js";
import User from "../db/models/user.js";
import userorganization from "../db/models/userorganization.js";
import AppError from "../util/appError.js";
import catchAsync from "../util/catchAsync.js";

export const createOrganization = catchAsync(async (req, res, next) => {
  const body = req.body;
  const newOrg = await organization.create({
    name: body.name,
    description: body.description,
    createdBy: req.user.userId,
  });
  if (!newOrg) {
    return next(new AppError("Client Error", 400));
  }

  const result = newOrg.toJSON()
 

  delete result.deletedAt;
  delete result.createdAt;
  delete result.updatedAt;
  delete result.createdBy;

  return res.status(201).json({
    status: "success",
    message: "organization created successfully",
    data: result,
  });
});

export const getOrganization = catchAsync(async (req, res, next) => {
  const userId = req.user.userId;
  const user = await User.findByPk(userId, {
    attributes: ["userId"],
    include: [
      {
        model: organization,
        as: "CreatedOrganizations",
        attributes: ["orgId", "name", "description"],
      },
      {
        model: organization,
        as: "AddedOrganizations",
        attributes: ["orgId", "name", "description"],
        through: { attributes: [] },
      },
    ],
  });

  if (!user) {
    return next(new AppError("Client Error", 400));
  }

  const organisations = [
    ...user.CreatedOrganizations,
    ...user.AddedOrganizations,
  ].reduce((acc, org) => {
    if (!acc.some((existingOrg) => existingOrg.orgId === org.orgId)) {
      acc.push(org.toJSON()); // Convert to plain object
    }
    return acc;
  }, []);

  res.status(200).json({
    status: "success",
    data: {
      organisations,
    },
  });
});

export const getUserById = catchAsync(async (req, res, next) => {
  const requestedUser = req.params.id;
  const requestingUser = req.user.userId;

  let data;

  const userQueryOptions = {
    attributes: ["userId", "firstName", "lastName", "email", "phone"],
  };

  if (requestedUser === requestingUser) {
    data = await User.findByPk(requestedUser, userQueryOptions);
  } else {
    const sharedOrganizations = await userorganization.findOne({
      where: {
        userId: requestingUser,
        orgId: {
          [Sequelize.Op.in]: Sequelize.literal(
            `(SELECT "orgId" FROM userorganization WHERE "userId" = '${requestedUser}')`
          ),
        },
      },
    });
    if (sharedOrganizations) {
      data = await User.findByPk(requestedUser, userQueryOptions);
    } else {
      return next(
        new AppError("You do not have permission to view this user", 403)
      );
    }
  }

  if (!data) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data,
  });
});

export const getSingleOrganization = catchAsync(async (req, res, next) => {
  const requestedUser = req.params.orgId;
  const orgQueryOptions = {
    attributes: ["orgId", "name", "description"],
  };
  const data = await organization.findByPk(requestedUser, orgQueryOptions);
  if (!data) {
    return next(new AppError("Organization not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "organization fetched successfully",
    data,
  });
});

export const addUserToOrganozation = catchAsync(async (req, res, next) => {
  const orgId = req.params.orgId;
  const userId = req.body.userId;

  // Check if both organization and user exist
  try {
    const [org, use] = await Promise.all([
      organization.findByPk(orgId),
      User.findByPk(userId),
    ]);

    if (!org || !use) {
      return next(new AppError('Organization or User Not Found', 404));
    }

    // Check if user is already a member of the organization
    const existingMembership = await userorganization.findOne({
      where: {
        userId,
        orgId,
      },
    });

    if (existingMembership) {
      return next(new AppError('User is already a member of this organization', 400));
    }

    // Create the association if checks pass
    const linkUsersAndOrg = await userorganization.create({
      userId,
      orgId,
    });

    res.status(200).json({
      status: "success",
      message: "User added to organization successfully",
    });
  } catch (error) {
    // Handle potential errors during creation or checks

    console.log(error);
    next(new AppError('Unable to add user to organization', 400, error));
  }
});

