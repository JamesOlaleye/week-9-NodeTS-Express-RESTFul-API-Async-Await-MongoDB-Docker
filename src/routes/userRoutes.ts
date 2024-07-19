import express, {Response, Request, NextFunction} from 'express'
import { signUp, signIn, signOut } from '../controller/userController'
import { authentification } from '../middlewares/auth'
const router = express.Router()

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/signout',authentification, signOut)

export default router
