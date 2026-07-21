import { Schema, model, Document, Types } from "mongoose";

export interface IRecipe extends Document {
  title: string;
  shortDescription: string;
  fullDescription: string;
  ingredients: string[];
  instructions: string[];
  cuisineType: string;
  dietType: string;
  prepTimeMinutes: number;
  difficulty: "Easy" | "Medium" | "Hard";
  imageUrl: string;
  images: string[];
  createdBy: Types.ObjectId;
  ratingAverage: number;
  ratingCount: number;
  isAiGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const recipeSchema = new Schema<IRecipe>(
  {
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    fullDescription: { type: String, required: true },
    ingredients: { type: [String], required: true, default: [] },
    instructions: { type: [String], required: true, default: [] },
    cuisineType: { type: String, required: true, index: true },
    dietType: { type: String, required: true, index: true },
    prepTimeMinutes: { type: Number, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    imageUrl: {
      type: String,
      default: "https://placehold.co/600x400?text=Recipe+Image",
    },
    images: { type: [String], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    isAiGenerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Supports the Explore page's search bar (title) alongside the
// cuisine/diet filters, which use the indexes above.
recipeSchema.index({ title: "text", shortDescription: "text" });

export const Recipe = model<IRecipe>("Recipe", recipeSchema);
