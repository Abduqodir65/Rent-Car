import { Router } from "express";
import walletController from "../controllers/wallet.controller.js";

const walletRouter = Router();

walletRouter
  .get("/", walletController.getAllWallets)
  .post("/add", walletController.createWallet)
  .put("/update/:walletId", walletController.updateWallet)
  .delete("/delete/:walletId", walletController.deleteWallet);

export default walletRouter;
