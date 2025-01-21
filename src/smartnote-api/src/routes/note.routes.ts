import { Router, Response } from "express";
import NoteService from "../services/note.service";
import dotenv from "dotenv";
import AuthenticatedRequest from "../interfaces/authenticatedRequest";
import authenticateToken from "../middleware/authenticatedRequest";

dotenv.config();

const router = Router();

router.use(authenticateToken);

router.post(
  "/askAI/debug",
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { prompt } = req.body;
      const userId = req.user?.userId;
      if (!userId || !prompt) {
        res.status(400).json({ error: "userId and prompt are required" });
        return;
      }

      console.log("userId:", userId);

      const response = await NoteService.debug_askAI(userId, prompt);
      res.json(response);
    } catch (error) {
      console.error("Error in askAI endpoint:", error);
      res.status(500).json({ error: "Failed to process AI request" });
    }
  }
);

router.post(
  "/askAI",
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { prompt } = req.body;
      const userId = req.user?.userId;
      if (!userId || !prompt) {
        res.status(400).json({ error: "userId and prompt are required" });
        return;
      }

      const response = await NoteService.askAI(userId, prompt);
      res.json(response);
    } catch (error) {
      console.error("Error in askAI endpoint:", error);
      res.status(500).json({ error: "Failed to process AI request" });
    }
  }
);

router.get(
  "/all",
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(400).json({ error: "missing userId" });
        return;
      }

      const notes = await NoteService.getNotes(userId);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  }
);

router.get(
  "/:id",
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(400).json({ error: "missing userId" });
        return;
      }

      const note = await NoteService.getNoteById(userId, req.params.id);
      if (!note) {
        res.status(404).json({ error: "Note not found" });
        return;
      }
      res.json(note);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch the note" });
    }
  }
);

router.post(
  "/",
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { title, content } = req.body;

      const userId = req.user?.userId;

      if (!userId || !title) {
        res.status(400).json({ error: "userId and title are required" });
        return;
      }
      const newNote = await NoteService.createNote({ userId, title, content });
      res.status(201).json(newNote);
    } catch (error) {
      res.status(500).json({ error: "Failed to create the note" });
    }
  }
);

router.put(
  "/:id",
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const { title, content } = req.body;

      if (!userId || !title) {
        res.status(400).json({ error: "userId and title are required" });
        return;
      }

      const updatedNote = await NoteService.updateNote(userId, req.params.id, {
        title,
        content,
      });
      if (!updatedNote) {
        res.status(404).json({ error: "Note not found" });
        return;
      }
      res.json(updatedNote);
    } catch (error) {
      res.status(500).json({ error: "Failed to update the note" });
    }
  }
);

router.delete(
  "/:id",
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(400).json({ error: "missing userId" });
        return;
      }

      const deletedNote = await NoteService.deleteNote(userId, req.params.id);
      if (!deletedNote) {
        res.status(404).json({ error: "Note not found" });
        return;
      }
      res.json({ message: "Note deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete the note" });
    }
  }
);

export default router;
