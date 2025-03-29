const express = require('express')
const slotController = require('../controllers/slotController')
const router = express.Router()

router.post('/shop-open',slotController.openShop)
router.post('/shop-close',slotController.closeShop)
router.post('/generate-slot',slotController.GenerateSlot)
router.get('/get-slots',slotController.getSlots)
router.post('/book-slot',slotController.bookSlot)
router.get('/get-user-slot/:userId',slotController.getUserBookedSlots)


module.exports = router;