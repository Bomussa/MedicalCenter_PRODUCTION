import express from 'express';
import { startExam, getPatientRoute } from '../controllers/patientController.js';

const router = express.Router();

router.post('/start', startExam);
router.get('/route/:sessionId', getPatientRoute);

export default router;


