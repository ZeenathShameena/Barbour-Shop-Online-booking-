const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required!'],
		},
        mobile: {
			type: String
		},
		address: {
			type: String
		},
		email: {
			type: String,
			required: [true, 'Email is required!'],
			trim: true,
			unique: [true, 'Email must be unique!'],
			minLength: [5, 'Email must have 5 characters!'],
			lowercase: true,
		},
		password: {
			type: String,
			required: [true, 'Password must be provided!'],
			trim: true,
			select: false,
		},
		forgotPasswordCode: {
			type: String,
			select: false,
		},
		forgotPasswordCodeValidation: {
			type: Number,
			select: false,
		},
		expoPushToken: {
			type: String,
			default: null
		},
		role:{
			type:String,
			default:'client'
		}
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('client', userSchema);
