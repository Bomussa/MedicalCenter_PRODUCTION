import express from 'express';
import { enterClinic } from '../controllers/visitsController.js';

const router = express.Router();

router.post('/enter', enterClinic);

export default router;


