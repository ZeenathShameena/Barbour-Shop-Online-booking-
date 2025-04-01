const express = require('express')
const adminController = require('../controllers/adminController')
const { identifier } = require('../middlewares/identification');

const router = express.Router()

router.post('/signup',adminController.adminSignup)
router.get('/details',identifier,adminController.adminDetails)
router.post('/update-admin',identifier,adminController.updateAdmin)
router.post('/update-category',adminController.CategoryUpdate)
router.get('/categories',adminController.Categories)
router.get('/shop-status',adminController.shopStatus)
router.post('/update-records',adminController.updateRecords)
router.get('/get-records',adminController.GetRecords)

module.exports = router;