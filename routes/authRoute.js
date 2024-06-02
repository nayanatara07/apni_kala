import express from 'express'
import { registerController, loginController, testController } from '../controllers/authController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';

//router object
const router = express.Router()

//routing
//REGISTER || METHOD POST
router.post('/register', registerController)

//LOGIN || POST
router.post('/login', loginController)

//test routes
//using requireSignIn middleware to protect the route. 
//only if token is passed and is correct the user can access this route.
router.get('/test', requireSignIn, testController)

export default router