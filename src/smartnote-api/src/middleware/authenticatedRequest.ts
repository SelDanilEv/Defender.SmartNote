import {
  Response,
  RequestHandler,
  NextFunction,
} from "express";
import jwt from "jsonwebtoken";
import UserMapper from "../mapper/user.mapper";
import AuthenticatedRequest from "../interfaces/authenticatedRequest";

const authenticateToken: RequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = UserMapper.MapUserInfo(decoded);
    next();
  } catch (ex) {
    res.status(403).json({ error: "Invalid token." });
    return;
  }
};

export default authenticateToken;
