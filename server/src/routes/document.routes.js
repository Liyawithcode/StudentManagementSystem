import express from "express";
import { getDocuments, uploadDocument, deleteDocument } from "../controller/document.controller.js";
import { protect } from "../middleware/auth.middleware.js";

export const documentRouter = express.Router();

documentRouter.use(protect);

documentRouter.route("/")
    .get(getDocuments)
    .post(uploadDocument);

documentRouter.delete("/:id", deleteDocument);
