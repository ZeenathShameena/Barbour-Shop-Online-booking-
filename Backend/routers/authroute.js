const express = require('express');
const authController = require('../controllers/authController');
const { identifier } = require('../middlewares/identification');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/signout', identifier, authController.signout);


router.patch(
	'/forgot-password',
	authController.sendForgotPasswordCode
);
router.patch(
	'/verify-forgot-password',
	authController.verifyForgotPasswordCode
);

router.post('/update-client', identifier, authController.updateclient);
router.get('/client', identifier, authController.client);
router.get('/get-all-clients', identifier, authController.getAllUsers);




module.exports = router;