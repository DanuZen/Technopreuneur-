import { Router, Request, Response } from 'express';

const router = Router();

// POST /api/applications (Submit internal application)
router.post('/', (req: Request, res: Response) => {
  res.json({ message: 'Submit application endpoint' });
});

// GET /api/applications/job/:jobId (Employer views ranked applicants)
router.get('/job/:jobId', (req: Request, res: Response) => {
  res.json({ applicants: [], message: 'Get ranked applicants by match score' });
});

export default router;

