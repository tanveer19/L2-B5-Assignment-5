import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

// const createUserFunction = ()=>{
//   const user = await UserServices.createUser(req.body);

//     res.status(httpStatus.CREATED).json({
//       message: "User created successfully",
//       user,
//     });
// }

// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // throw new Error("fake error");
//     // throw new AppError(httpStatus.BAD_REQUEST, "fake error");

//   } catch (err: any) {
//     console.log(err);
//     next(err);
//   }
// };

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    // res.status(httpStatus.CREATED).json({
    //   message: "User created successfully",
    //   user,
    // });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User created successfully",
      data: user,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(
    //   token as string,
    //   envVars.JWT_ACCESS_SECRET
    // ) as JwtPayload;

    const verifiedToken = req.user;

    const payload = req.body;
    const user = await UserServices.updateUser(
      userId,
      payload,
      verifiedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User updated successfully",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();

    // res.status(httpStatus.OK).json({
    //   success: true,
    //   message: "All users retrived",
    //   data: users,
    // });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "All users retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

export const UserControllers = { createUser, getAllUsers, updateUser };

// route matching > controller > service > model > DB
