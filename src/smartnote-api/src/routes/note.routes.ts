import { Router, Request, Response } from "express";
import Note from "../models/note.model";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const router = Router();

const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models";
const MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.3";

router.post("/askAI", async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, prompt } = req.body;

    if (!userId || !prompt) {
      res.status(400).json({ error: "userId and prompt are required" });
      return;
    }

    // Fetch all notes for the user
    const userNotes = await Note.find({ userId });
    if (!userNotes || userNotes.length === 0) {
      res.status(404).json({ error: "No notes found for the user" });
      return;
    }

    const notesSummary = userNotes
      .map(
        (note, index) =>
          `${index}) Title: ${note.title}, Content: ${note.content}. `
      )
      .join();

    const fullPrompt = `You are notes app assistant. You have to know that today is ${new Date().toDateString()}. Here are the user's notes: ${notesSummary}. Respond directrly, human readable and as short as possible. Hide all details that are not related to the request. User's request: ${prompt}. !EOR!`;

    const response = await axios.post(
      `${HUGGINGFACE_API_URL}/${MODEL_NAME}`,
      { inputs: fullPrompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const generatedText =
      response.data?.[0]?.generated_text || "No response from AI.";
    const eorIndex = generatedText.indexOf("!EOR!");
    const finalText =
      eorIndex !== -1
        ? generatedText.substring(eorIndex + 5).trim()
        : generatedText;

    res.json({ text: finalText });
  } catch (error) {
    console.error("Error in askAI endpoint:", error);

    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: "Failed to process AI request" });
    }
  }
});

router.get("/:userId", async (req: Request, res: Response): Promise<void> => {
  try {
    const notes = await Note.find({ userId: req.params.userId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

router.get(
  "/:userId/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const note = await Note.findOne({
        _id: req.params.id,
        userId: req.params.userId,
      });
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
      res.status(400).json({ error: "userId, title are required" });
      return;
    }
    const newNote = new Note({
      userId,
      title,
      content,
    });
    await newNote.save();
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
      const updatedNote = await Note.findOneAndUpdate(
        { _id: req.params.id, userId: req.params.userId },
        { title, content },
        { new: true }
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
      const deletedNote = await Note.findOneAndDelete({
        _id: req.params.id,
        userId: req.params.userId,
      });
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
