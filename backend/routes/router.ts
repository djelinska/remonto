import express from 'express'
import projects from './project/projectRoutes'
import authRoutes from './auth/authRoutes'
import tokenDecode from './token/tokenDecode'
import userRoutes from "./user/userRoutes"
const router = express.Router();

router.use(tokenDecode);
router.use(projects);
router.use(authRoutes);
router.use(userRoutes);
export default router
