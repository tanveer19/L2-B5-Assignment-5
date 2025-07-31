import { Request, Response, NextFunction } from "express";
import { WalletServices } from "./wallet.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";

export const WalletController = {
  addMoney: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id; // assuming you have req.user set by auth middleware
    const { amount } = req.body;

    const wallet = await WalletServices.addMoney(userId, amount);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Money added successfully",
      data: wallet,
    });
  }),

  withdrawMoney: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { amount } = req.body;

    const wallet = await WalletServices.withdrawMoney(userId, amount);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Withdrawal successful",
      data: wallet,
    });
  }),

  sendMoney: catchAsync(async (req: Request, res: Response) => {
    const fromId = req.user?._id;
    const { toPhone, amount } = req.body;

    const result = await WalletServices.sendMoney(fromId, toPhone, amount);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Money sent successfully",
      data: result,
    });
  }),

  getTransactionHistory: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const transactions = await WalletServices.getTransactionHistory(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Transaction history retrieved successfully",
      data: transactions,
    });
  }),
};
