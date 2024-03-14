import express from "express";

import { login, register, getAllUsers } from "../Controllers/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/get-all-user", getAllUsers);


export default router;