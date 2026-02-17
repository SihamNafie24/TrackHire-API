import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.get('/stats', authenticate, DashboardController.getStats);

export default router;
