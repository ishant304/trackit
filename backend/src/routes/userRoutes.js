import express from "express"
import { getProfile, loginUser, logoutUser, registerUser } from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/profile", protect, getProfile)
router.get("/logout", protect, logoutUser)

export default router;