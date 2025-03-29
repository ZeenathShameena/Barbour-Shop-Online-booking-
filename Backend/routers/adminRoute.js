const express = require('express')
const adminController = require('../controllers/adminController')
const { identifier } = require('../middlewares/identification');

const router = express.Router()

router.post('/signup',adminController.adminSignup)
router.get('/details/:id',identifier,adminController.adminDetails)
router.post('/update-category',adminController.CategoryUpdate)
router.get('/categories',adminController.Categories)
router.get('/shop-status',adminController.shopStatus)
router.get('/shop-records',adminController.Records)

module.exports = router;