import express from 'express';
const router = express.Router();

router.get('/some-route', (req, res) => {
  res.status(200).json({ message: 'Success' });
});

export default router;
