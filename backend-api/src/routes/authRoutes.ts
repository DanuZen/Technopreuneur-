import { Router, Request, Response } from 'express';

const router = Router();

// POST /api/auth/register
router.post('/register', (req: Request, res: Response) => {
  res.json({ message: 'Register endpoint ready - to be implemented with bcrypt & db' });
});

// POST /api/auth/login
router.post('/login', (req: Request, res: Response) => {
  res.json({ message: 'Login endpoint ready - to be implemented with JWT' });
});

export default router;

