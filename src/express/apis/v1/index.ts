import express from 'express';
import challenges from './challenges';

const router = express.Router();

router.use('/challenges', challenges);

export default router;
