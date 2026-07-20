import { Schema, model, Document, Types } from "mongoose";

export type ChatRole = "user" | "assistant";

export interface IChatMessage {
  role: ChatRole;
  content: string;
  timestamp: Date;
}

export interface IConversation extends Document {
  userId: Types.ObjectId;
  recipeId?: Types.ObjectId; // present when chat is opened in the context of a specific recipe
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const conversationSchema = new Schema<IConversation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    recipeId: { type: Schema.Types.ObjectId, ref: "Recipe" },
    messages: { type: [chatMessageSchema], default: [] },
  },
  { timestamps: true }
);

export const Conversation = model<IConversation>("Conversation", conversationSchema);
