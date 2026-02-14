import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validate } from '../middlewares/validateMiddleware';
import { registerSchema, loginSchema } from '../utils/validationSchemas';

import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.get('/me', authenticate, AuthController.getMe);

export default router;
