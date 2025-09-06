import express from 'express';
import { loginLocalJWT } from '../controllers/sessionController.js';

const userRouter = express.Router();

userRouter.post("/login", loginLocalJWT);