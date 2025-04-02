const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const auth = require('../middlewares/authMiddleware');

router.get('/skill-partner/:skillPartnerId', ratingController.getSkillPartnerRatings);
router.post('/', auth, ratingController.createRating);
router.put('/:id/helpful', auth, ratingController.markRatingHelpful);
router.post('/:id/respond', auth, ratingController.addRatingResponse);
router.post('/:id/report', auth, ratingController.reportRating);

module.exports = router;