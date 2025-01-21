import User from "./user";
import { Request } from "express";

interface AuthenticatedRequest extends Request {
  user?: User;
}

export default AuthenticatedRequest;
