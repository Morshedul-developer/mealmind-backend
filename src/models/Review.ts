import { Schema, model, Document, Types } from "mongoose";

export interface IReview extends Document {
  recipeId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// One review per user per recipe.
reviewSchema.index({ recipeId: 1, userId: 1 }, { unique: true });

export const Review = model<IReview>("Review", reviewSchema);
