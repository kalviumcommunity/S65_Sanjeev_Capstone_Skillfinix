const express = require("express");
const router = express.Router();
const exchangeController = require('../controllers/exchangeController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, exchangeController.initiateExchange);
router.put('/:id/accept', auth, exchangeController.acceptExchange);
router.post('/resources', auth, exchangeController.addExchangeResource);
router.get('/potential-partners', auth, exchangeController.getPotentialPartners);

module.exports = router;