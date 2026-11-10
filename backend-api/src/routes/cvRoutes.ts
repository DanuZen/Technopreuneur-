import { Router, Request, Response } from 'express';

const router = Router();

// POST /api/cvs/upload-url (Generate pre-signed URL for direct upload)
router.post('/upload-url', (req: Request, res: Response) => {
  res.json({ message: 'Generate secure pre-signed upload URL' });
});

// DELETE /api/cvs/:id (UU PDP Right to be forgotten)
router.delete('/:id', (req: Request, res: Response) => {
  res.json({ message: 'Permanently delete CV, profile, embedding and related matches' });
});

export default router;

