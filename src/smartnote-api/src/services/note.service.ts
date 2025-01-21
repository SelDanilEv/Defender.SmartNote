import Note from "../db.models/note.model";
import dotenv from "dotenv";
import PromptBuilder from "../builders/LLMPrompt.builder";
import MistalWrapper from "../wrappers/mistral.wrapper";
import GoogleFlanWrapper from "../wrappers/googleFlan.wrapper";

dotenv.config();

class NoteService {
  static async debug_askAI(userId: string, prompt: string) {
    const userNotes = await Note.find({ userId });
    if (!userNotes || userNotes.length === 0) {
      throw new Error("No notes found for the user");
    }

    const notesSummary = userNotes
      .map(
        (note, index) =>
          `${index}) Title: ${note.title}, Content: ${note.content}. `
      )
      .join("");

    const createNoteCommand = "CreateNote";

    const systemPrompt = PromptBuilder.init()
      .addCurrentDate()
      .addNotesSummary(notesSummary)
      .addClassificationPrompt({
        [createNoteCommand]:
          "User clearly asking to create a new note (has words like create).",
        NoteInfo: "User asking for information about his notes.",
        InvalidRequest:
          "Request is invalid or unclear or has no sense (Default).",
      })
      .addUserRequest(prompt)
      .toString();

    const command = await GoogleFlanWrapper.askAI(systemPrompt);

    if (command.answer == "InvalidRequest") {
      return { answer: "Invalid request. Please try again." };
    } else if (command.answer == createNoteCommand) {
      const noteDataPromt = PromptBuilder.init()
        .addCustomInstruction(
          "From the user request make a note entity. The response must be valid JSON object. Sample: { title: 'Title', content: 'Content' }"
        )
        .addUserRequest(prompt)
        .toString();

      const noteToCreate = await MistalWrapper.askAI(noteDataPromt, true);

      return noteToCreate;
    }

    const finalPrompt = PromptBuilder.init()
      .addCurrentDate()
      .addNotesSummary(notesSummary)
      .addUserResponseHints()
      .addUserRequest(prompt)
      .toString();

    const response = await MistalWrapper.askAI(finalPrompt, true);

    return response;
  }

  static async askAI(userId: string, prompt: string) {
    const userNotes = await Note.find({ userId });
    if (!userNotes) {
      throw new Error("No notes found for the user");
    }

    const notesSummary = userNotes
      .map(
        (note, index) =>
          `${index}) Title: ${note.title}, Content: ${note.content}. `
      )
      .join("");

    const createNoteCommand = "CreateNote";

    const systemPrompt = PromptBuilder.init()
      .addCurrentDate()
      .addNotesSummary(notesSummary)
      .addClassificationPrompt({
        [createNoteCommand]:
          "User clearly asking to create a new note (has words like create).",
        NoteInfo: "User asking for information about his notes.",
        InvalidRequest:
          "Request is invalid or unclear or has no sense (Default).",
      })
      .addUserRequest(prompt)
      .toString();

    const command = await GoogleFlanWrapper.askAI(systemPrompt);

    if (command.answer == "InvalidRequest") {
      return { answer: "Invalid request. Please try again." };
    } else if (command.answer == createNoteCommand) {
      const noteDataPromt = PromptBuilder.init()
        .addCustomInstruction(
          "From the user request make a note entity. The response must be only valid JSON object ready to deserialize. Sample: { title: string, content: string }"
        )
        .addUserRequest(prompt)
        .toString();

      try {
        const noteToCreate = await MistalWrapper.askAI(noteDataPromt);

        console.log("Note noteToCreate:", noteToCreate);

        const jsonString = noteToCreate.answer.replaceAll("`", "");

        console.log("Note jsonString:", jsonString);

        const noteData = JSON.parse(jsonString);

        noteData.userId = userId;

        console.log("Note data:", noteData);

        this.createNote(noteData);

        return { answer: `Note ${noteData.title} was created.` };
      } catch (error) {}

      return { answer: "Invalid note data. Please try again." };
    }

    const finalPrompt = PromptBuilder.init()
      .addCurrentDate()
      .addNotesSummary(notesSummary)
      .addUserResponseHints()
      .addUserRequest(prompt)
      .toString();

    const response = await MistalWrapper.askAI(finalPrompt);

    return response;
  }

  static async getNotes(userId: string) {
    return Note.find({ userId });
  }

  static async getNoteById(userId: string, id: string) {
    return Note.findOne({ _id: id, userId });
  }

  static async createNote(noteData: {
    userId: string;
    title: string;
    content?: string;
  }) {
    const newNote = new Note(noteData);
    return newNote.save();
  }

  static async updateNote(
    userId: string,
    id: string,
    updateData: { title?: string; content?: string }
  ) {
    return Note.findOneAndUpdate({ _id: id, userId }, updateData, {
      new: true,
    });
  }

  static async deleteNote(userId: string, id: string) {
    return Note.findOneAndDelete({ _id: id, userId });
  }
}

export default NoteService;
