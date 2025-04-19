// models/promoCodeModel.js
import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  discountType: {
    type: String,
    enum: ["percentage", "flat"],
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
  },
  usageLimit: {
    type: Number,
    default: null, // null = unlimited
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  expiresAt: {
    type: Date,
    default: null, // null = never expires
  },
}, { timestamps: true });

export const promoCodeModel = mongoose.model("PromoCode", promoCodeSchema);
