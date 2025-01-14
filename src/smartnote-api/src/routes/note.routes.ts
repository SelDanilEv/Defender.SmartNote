import { Router, Request, Response } from "express";
import NoteService from "../services/note.service";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.post(
  "/askAI/debug",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, prompt } = req.body;
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

router.post("/askAI", async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, prompt } = req.body;
    if (!userId || !prompt) {
      res.status(400).json({ error: "userId and prompt are required" });
      return;
    }

    console.log("userId:", userId);

    const response = await NoteService.askAI(userId, prompt);
    res.json(response);
  } catch (error) {
    console.error("Error in askAI endpoint:", error);
    res.status(500).json({ error: "Failed to process AI request" });
  }
});

router.get("/:userId", async (req: Request, res: Response): Promise<void> => {
  try {
    const notes = await NoteService.getNotes(req.params.userId);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

router.get(
  "/:userId/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const note = await NoteService.getNoteById(
        req.params.userId,
        req.params.id
      );
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

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, title, content } = req.body;
    if (!userId || !title) {
      res.status(400).json({ error: "userId and title are required" });
      return;
    }
    const newNote = await NoteService.createNote({ userId, title, content });
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: "Failed to create the note" });
  }
});

router.put(
  "/:userId/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, content } = req.body;
      const updatedNote = await NoteService.updateNote(
        req.params.userId,
        req.params.id,
        { title, content }
      );
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
  "/:userId/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const deletedNote = await NoteService.deleteNote(
        req.params.userId,
        req.params.id
      );
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
