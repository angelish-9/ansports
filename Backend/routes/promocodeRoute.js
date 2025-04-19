import express from 'express'
import { promoCodeModel } from './../models/promoCodeModel.js';
import { verifyAdmin } from "../middleware/adminAuth.js";

const promocodeRouter = express.Router()

// Admin: Create Promo Code
promocodeRouter.post("/", verifyAdmin, async (req, res) => {
  try {
    const promo = new promoCodeModel(req.body);
    await promo.save();
    res.status(201).json({ message: "Promo code created", promo });
  } catch (err) {
    res.status(400).json({ error: "Failed to create promo code", details: err.message });
  }
});

// Admin: Get All Promo Codes
promocodeRouter.get("/", verifyAdmin, async (req, res) => {
  try {
    const promos = await promoCodeModel.find();
    res.json(promos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch promo codes" });
  }
});

// Admin: Update Promo Code
promocodeRouter.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updated = await promoCodeModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Promo code not found" });
    res.json({ message: "Promo code updated", promo: updated });
  } catch (err) {
    res.status(400).json({ error: "Failed to update promo code", details: err.message });
  }
});

// Admin: Delete Promo Code
promocodeRouter.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const deleted = await promoCodeModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Promo code not found" });
    res.json({ message: "Promo code deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete promo code" });
  }
});


promocodeRouter.post("/apply", async (req, res) => {
  const { code, amount } = req.body;

  try {
    const promo = await promoCodeModel.findOne({ code: code.toUpperCase() });

    if (!promo) return res.status(404).json({ error: "Promo code not found" });

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return res.status(400).json({ error: "Promo code has expired" });
    }

    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
      return res.status(400).json({ error: "Promo code usage limit reached" });
    }

    let discount = 0;

    if (promo.discountType === "percentage") {
      discount = (promo.discountValue / 100) * amount;
    } else {
      discount = promo.discountValue;
    }

    const discountedTotal = Math.max(amount - discount, 0);

    res.json({
      success: true,
      discount,
      discountedTotal,
      message: "Promo code applied",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default promocodeRouter
