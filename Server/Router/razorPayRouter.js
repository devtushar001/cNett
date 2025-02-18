import express from "express";
import { createRazorPayOrderController, verifyRazorPayOrderController } from "../Controller/razorPayController.js";

const razorPayRouter = express.Router();

razorPayRouter.post('/create-order', createRazorPayOrderController);
razorPayRouter.get('/verify-order', verifyRazorPayOrderController);

export default razorPayRouter;