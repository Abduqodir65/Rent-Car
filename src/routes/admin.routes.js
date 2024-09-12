import { Router } from "express";
import adminController from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter
  .get("/", adminController.getAllAdmins)
  .post("/add", adminController.createAdmin)
  .put("/update/:adminId", adminController.updateAdmin)
  .delete("/delete/:adminId", adminController.deleteAdmin);

export default adminRouter;
