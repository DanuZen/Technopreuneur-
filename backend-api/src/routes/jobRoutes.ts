import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/jobs (Search & filter)
router.get('/', (req: Request, res: Response) => {
  res.json({ jobs: [], total: 0, message: 'Job search & filter endpoint' });
});

// POST /api/jobs (Create job by employer)
router.post('/', (req: Request, res: Response) => {
  res.json({ message: 'Create job endpoint - triggers embedding job' });
});

export default router;

