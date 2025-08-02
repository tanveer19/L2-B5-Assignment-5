import { Request, Response } from "express";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import { Transaction } from "../transaction/transaction.model";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";

const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find({ role: "USER" });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All users retrieved successfully",
    data: users,
  });
};

const getAllAgents = async (req: Request, res: Response) => {
  const agents = await User.find({ role: "AGENT" });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All agents retrieved successfully",
    data: agents,
  });
};

const getAllWallets = async (req: Request, res: Response) => {
  const wallets = await Wallet.find().populate("user");
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All wallets retrieved successfully",
    data: wallets,
  });
};

const getAllTransactions = async (req: Request, res: Response) => {
  const transactions = await Transaction.find().populate("user");
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All transactions retrieved successfully",
    data: transactions,
  });
};

const blockWallet = async (req: Request, res: Response) => {
  const { walletId } = req.params;
  const wallet = await Wallet.findById(walletId);
  if (!wallet) throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");

  wallet.isBlocked = true;
  await wallet.save();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Wallet blocked successfully",
    data: wallet,
  });
};

const unblockWallet = async (req: Request, res: Response) => {
  const { walletId } = req.params;
  const wallet = await Wallet.findById(walletId);
  if (!wallet) throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");

  wallet.isBlocked = false;
  await wallet.save();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Wallet unblocked successfully",
    data: wallet,
  });
};

const approveAgent = async (req: Request, res: Response) => {
  const { agentId } = req.params;
  const agent = await User.findOne({ _id: agentId, role: "AGENT" });
  if (!agent) throw new AppError(httpStatus.NOT_FOUND, "Agent not found");

  agent.isActive = "ACTIVE";
  await agent.save();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Agent approved successfully",
    data: agent,
  });
};

const suspendAgent = async (req: Request, res: Response) => {
  const { agentId } = req.params;
  const agent = await User.findOne({ _id: agentId, role: "AGENT" });
  if (!agent) throw new AppError(httpStatus.NOT_FOUND, "Agent not found");

  agent.isActive = "SUSPENDED";
  await agent.save();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Agent suspended successfully",
    data: agent,
  });
};

export const AdminController = {
  getAllUsers,
  getAllAgents,
  getAllWallets,
  getAllTransactions,
  blockWallet,
  unblockWallet,
  approveAgent,
  suspendAgent,
};
