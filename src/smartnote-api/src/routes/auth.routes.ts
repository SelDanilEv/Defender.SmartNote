import { Router, Response } from "express";
import AuthenticatedRequest from "../interfaces/authenticatedRequest";
import authenticateToken from "../middleware/authenticatedRequest";

const router = Router();

router.use(authenticateToken);

router.get(
  "/user-info",
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const user = req.user;

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user info" });
    }
  }
);

export default router;
