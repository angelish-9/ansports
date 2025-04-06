import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";

export const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await userModel.findById(decoded.id);

        if (!user || user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Forbidden: Admin access required" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};
