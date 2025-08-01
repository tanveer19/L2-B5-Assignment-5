import { Request, Response, NextFunction } from "express";
import { Wallet } from "./wallet.model"; // assuming you have a wallet model
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { Transaction } from "../transaction/transaction.model";
import { User } from "../user/user.model";

export const WalletController = {
  addMoney: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req.user as { userId: string }).userId;

      const user = await User.findById(userId);
      if (!user || !user.wallet) {
        throw new AppError(httpStatus.NOT_FOUND, "User or wallet not found");
      }

      const wallet = await Wallet.findById(user.wallet);
      if (!wallet) {
        throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
      }

      const amount = Number(req.body.amount);
      if (!amount || amount <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
      }

      wallet.balance += amount;
      await wallet.save();

      res.status(httpStatus.OK).json({
        success: true,
        message: "Money added successfully",
        data: {
          balance: wallet.balance,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  withdrawMoney: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("▶️ Withdraw Money called");
      const { amount } = req.body;
      const user = req.user;

      if (!user)
        throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");

      const wallet = await Wallet.findOne({ userId: user.userId });
      if (!wallet) throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");

      if (wallet.balance < amount) {
        throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
      }

      wallet.balance -= amount;
      await wallet.save();

      res.status(httpStatus.OK).json({
        success: true,
        message: "Money withdrawn successfully",
        data: wallet,
      });
    } catch (error) {
      next(error);
    }
  },

  sendMoney: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("▶️ Send Money called");
      const { toPhone, amount } = req.body;
      const user = req.user;

      if (!user)
        throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");

      const senderWallet = await Wallet.findOne({ userId: user.userId });
      if (!senderWallet)
        throw new AppError(httpStatus.NOT_FOUND, "Sender wallet not found");

      if (senderWallet.balance < amount) {
        throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
      }

      const receiverWallet = await Wallet.findOne({ phone: toPhone });
      if (!receiverWallet)
        throw new AppError(httpStatus.NOT_FOUND, "Receiver wallet not found");

      senderWallet.balance -= amount;
      receiverWallet.balance += amount;

      await senderWallet.save();
      await receiverWallet.save();

      res.status(httpStatus.OK).json({
        success: true,
        message: "Money sent successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  getTransactionHistory: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("▶️ Get Transactions called");
      const user = req.user;

      if (!user)
        throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");

      const transactions = await Transaction.find({ userId: user.userId });

      res.status(httpStatus.OK).json({
        success: true,
        data: transactions,
      });
    } catch (error) {
      next(error);
    }
  },
};
