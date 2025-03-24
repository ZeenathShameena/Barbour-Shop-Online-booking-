const express = require('express')
const adminController = require('../controllers/adminController')
const { identifier } = require('../middlewares/identification');

const router = express.Router()

//router.post('/signin',adminController.adminSignin)
router.post('/signup',adminController.adminSignup)
router.get('/details/:id',identifier,adminController.adminDetails)
router.post('Update-Category',adminController.CategoryUpdate)
router.get('categories',adminController.Categories)
module.exports = router;