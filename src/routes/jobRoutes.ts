import { Router } from 'express';
import { JobController } from '../controllers/jobController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { createJobSchema, updateJobSchema } from '../utils/validationSchemas';

const router = Router();

router.get('/', JobController.getAllJobs);
router.get('/:id', JobController.getJobById);

router.post(
    '/',
    authenticate,
    authorize('ADMIN'),
    validate(createJobSchema),
    JobController.createJob
);

router.put(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    validate(updateJobSchema),
    JobController.updateJob
);

router.delete(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    JobController.deleteJob
);

export default router;
