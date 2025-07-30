import cookieParser from "cookie-parser";
import { envVars } from "./app/config/env";
import express, { Request, Response } from "express";
import expressSession from "express-session";
import cors from "cors";
import { UserRoutes } from "./app/modules/user/user.route";
import { AuthRoutes } from "./app/modules/auth/auth.route";

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

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Digital Wallet it is",
  });
});

export default app;
