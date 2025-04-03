import { Router } from "express";
import { generatePDF, generateExcel } from "../controllers/reportController.js";

const router = Router();

router.get("/pdf/:role?", generatePDF);
router.get("/excel/:role?", generateExcel);

export default router;
