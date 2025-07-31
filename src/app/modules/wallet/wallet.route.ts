import express from "express";
import { WalletController } from "./wallet.controller";
import { auth } from "../auth/auth.middleware"; // adjust path as needed

const router = express.Router();

// All routes below require authenticated users
router.post("/add-money", auth(), WalletController.addMoney);
router.post("/withdraw", auth(), WalletController.withdrawMoney);
router.post("/send", auth(), WalletController.sendMoney);
router.get("/transactions", auth(), WalletController.getTransactionHistory);

export const WalletRoutes = router;
