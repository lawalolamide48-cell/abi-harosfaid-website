const express = require('express');
const router = express.Router();
const {
  getServices,
  getAllServicesAdmin,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');

router.get('/', getServices);
router.get('/all', protect, getAllServicesAdmin);
router.get('/:slug', getServiceBySlug);
router.post('/', protect, createService);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

module.exports = router;
