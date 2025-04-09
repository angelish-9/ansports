import express from 'express'
import authUser from '../middleware/auth.js'

import { loginUser,registerUser, getCurrentUser } from '../controller/userController.js'

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/current', authUser, getCurrentUser);

export default userRouter