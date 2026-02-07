import express from 'express'
import protect from '../middleware/authMiddleware.js';
import { deleteExpense, getExpense, getExpenseById, postExpense, updateExpense } from '../controllers/expenseController.js';
import { getExpenseSummary } from '../controllers/summaryController.js';

const router = express.Router()

router.get("/", protect, getExpense)
router.get("/:id",protect, getExpenseById)
router.post("/", protect, postExpense)
router.delete("/:id", protect, deleteExpense)
router.put("/:id", protect, updateExpense)

export default router;