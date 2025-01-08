"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const note_model_1 = __importDefault(require("../models/note.model"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models";
const MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.3";
router.post("/askAI", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { userId, prompt } = req.body;
        if (!userId || !prompt) {
            res.status(400).json({ error: "userId and prompt are required" });
            return;
        }
        // Fetch all notes for the user
        const userNotes = yield note_model_1.default.find({ userId });
        if (!userNotes || userNotes.length === 0) {
            res.status(404).json({ error: "No notes found for the user" });
            return;
        }
        const notesSummary = userNotes
            .map((note, index) => `${index}) Title: ${note.title}, Content: ${note.content}. `)
            .join();
        const fullPrompt = `You are notes app assistant. You have to know that today is ${new Date().toDateString()}. Here are the user's notes: ${notesSummary}. Respond directrly, human readable and as short as possible. Hide all details that are not related to the request. User's request: ${prompt}. !EOR!`;
        const response = yield axios_1.default.post(`${HUGGINGFACE_API_URL}/${MODEL_NAME}`, { inputs: fullPrompt }, {
            headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                "Content-Type": "application/json",
            },
        });
        const generatedText = ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.generated_text) || "No response from AI.";
        const eorIndex = generatedText.indexOf("!EOR!");
        const finalText = eorIndex !== -1
            ? generatedText.substring(eorIndex + 5).trim()
            : generatedText;
        res.json({ text: finalText });
    }
    catch (error) {
        console.error("Error in askAI endpoint:", error);
        if (axios_1.default.isAxiosError(error) && error.response) {
            res.status(error.response.status).json({ error: error.response.data });
        }
        else {
            res.status(500).json({ error: "Failed to process AI request" });
        }
    }
}));
router.get("/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notes = yield note_model_1.default.find({ userId: req.params.userId });
        res.json(notes);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch notes" });
    }
}));
router.get("/:userId/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = yield note_model_1.default.findOne({
            _id: req.params.id,
            userId: req.params.userId,
        });
        if (!note) {
            res.status(404).json({ error: "Note not found" });
            return;
        }
        res.json(note);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch the note" });
    }
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, title, content } = req.body;
        if (!userId || !title) {
            res.status(400).json({ error: "userId, title are required" });
            return;
        }
        const newNote = new note_model_1.default({
            userId,
            title,
            content,
        });
        yield newNote.save();
        res.status(201).json(newNote);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create the note" });
    }
}));
router.put("/:userId/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        const updatedNote = yield note_model_1.default.findOneAndUpdate({ _id: req.params.id, userId: req.params.userId }, { title, content }, { new: true });
        if (!updatedNote) {
            res.status(404).json({ error: "Note not found" });
            return;
        }
        res.json(updatedNote);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update the note" });
    }
}));
router.delete("/:userId/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedNote = yield note_model_1.default.findOneAndDelete({
            _id: req.params.id,
            userId: req.params.userId,
        });
        if (!deletedNote) {
            res.status(404).json({ error: "Note not found" });
            return;
        }
        res.json({ message: "Note deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete the note" });
    }
}));
exports.default = router;
