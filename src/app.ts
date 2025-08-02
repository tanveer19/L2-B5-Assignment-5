import cookieParser from "cookie-parser";
import { envVars } from "./app/config/env";
import express, { Request, Response } from "express";
import expressSession from "express-session";
import cors from "cors";
import { UserRoutes } from "./app/modules/user/user.route";
import { AuthRoutes } from "./app/modules/auth/auth.route";
import { WalletRoutes } from "./app/modules/wallet/wallet.route";
import { AgentRoutes } from "./app/modules/agent/agent.route";

const app = express();

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/wallet", WalletRoutes);
app.use("/api/v1/agent", AgentRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Digital Wallet it is",
  });
});

export default app;
