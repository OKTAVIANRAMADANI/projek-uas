import express from "express";
import {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  upload
} from "../controllers/roomController.js";

const router = express.Router();

router.get("/", getAllRooms);
router.post("/", upload.single("image"), createRoom);
router.put("/:id", upload.single("image"), updateRoom);
router.delete("/:id", deleteRoom);

export default router;
