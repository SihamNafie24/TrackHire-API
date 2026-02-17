import { Router } from 'express';
import { ApplicationController } from '../controllers/applicationController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { updateApplicationStatusSchema } from '../utils/validationSchemas';

const router = Router();

router.post('/', authenticate, authorize('USER'), ApplicationController.applyToJob);
router.get('/my', authenticate, authorize('USER'), ApplicationController.getMyApplications);
router.get('/', authenticate, authorize('ADMIN'), ApplicationController.getAllApplications);
router.patch(
    '/:id/status',
    authenticate,
    authorize('ADMIN', 'USER'),
    validate(updateApplicationStatusSchema),
    ApplicationController.updateApplicationStatus
);

export default router;
