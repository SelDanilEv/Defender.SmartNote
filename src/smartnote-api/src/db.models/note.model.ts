import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
}

const NoteSchema: Schema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

// Override the default `_id` field to use it as `id` in responses
NoteSchema.set("toJSON", {
  virtuals: true,
  transform: (_, converted) => {
    converted.id = converted._id;
    delete converted._id;
    delete converted.__v;
    return converted;
  },
});

export default mongoose.model<INote>("Note", NoteSchema);
