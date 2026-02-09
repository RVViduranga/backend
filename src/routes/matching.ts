import { Router } from 'express';

const router = Router();

// Dummy matching route for now
router.get('/', (req, res) => {
  res.json({ message: 'Matching route works!' });
});

export default router;
