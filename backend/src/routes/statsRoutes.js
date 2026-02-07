import express from "express"
import protect from "../middleware/authMiddleware.js"
import { getCategorySummary, getExpenseSummary } from "../controllers/summaryController.js"

const router = express.Router()

router.get("/summary", protect, getExpenseSummary)
router.get("/category", protect, getCategorySummary)

export default router