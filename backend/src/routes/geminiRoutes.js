import express from "express"
import { geminiResponse } from "../controllers/geminiController.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.post("/", upload.single('file') , geminiResponse )

export default router