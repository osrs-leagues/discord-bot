import express from 'express';

import { getChallenges } from './challenges.controller';

const router = express.Router();

router.get('/', getChallenges);

export default router;
