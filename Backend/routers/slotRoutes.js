const express = require('express')
const slotController = require('../controllers/slotController')
const router = express.Router()

router.post('/set-open',slotController.openShop)
router.post('/set-close',slotController.closeShop)
router.post('/book-slot',slotController.bookSlot)
router.get('/get-slots',slotController.getSlots)
router.get('/get-user-slot/:userId',slotController.getUserBookedSlots)

module.exports = router;