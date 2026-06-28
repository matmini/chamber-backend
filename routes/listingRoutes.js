import express from 'express'; 
import { createListing, getListings, getListingById } from '../controllers/listingController.js'
import { requireAuth } from '../middleware/authMiddleware.js';
const router = express.Router(); 


router.get('/', getListings);
router.get('/:id', getListingById);
router.post('/', requireAuth, createListing);
export default router;