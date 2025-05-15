import express from 'express';
import {
  createRequest,
  getRequests,
  getRequest
} from '../controllers/interpreterController.js'; 

const router = express.Router();

// GET all requests
router.get('/', getRequests);

// GET a single request
router.get('/:id', getRequest);

// POST a new request
router.post('/', createRequest);

export default router; 
