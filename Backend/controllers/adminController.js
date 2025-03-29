const Admin = require('../models/admin');
const collection = require('../models/category');
const Shop = require('../models/shop');
const records = require('../models/record')
const TimeSlot = require('../models/timeSlot')
const jwt = require('jsonwebtoken');
const { signupSchema} = require('../middlewares/validator');
const { doHash} = require('../utils/hashing');

exports.adminSignup = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { error, value } = signupSchema.validate({ email, password });
        if (error) {
            return res
                .status(401)
                .json({ success: false, message: error.details[0].message });
        }
        
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res
            .status(401)
            .json({ success: false, message: 'Admin already exists' });
        }
        const hashedPassword = await doHash(password, 12);
        
        // Create a new admin (the pre-save hook will hash the password)
        const newAdmin = new Admin({ email, password: hashedPassword });
        await newAdmin.save();
        res.status(201).json({ success: true, message: 'Admin created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

exports.adminDetails = async (req,res)=>{
    try {
        const { id } = req.params;

        // Find admin by ID, exclude password
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

exports.CategoryUpdate = async (req, res) => {
	const { title, price } = req.body;
	try{
		const existing = await collection.findOne({ title })
		if(existing){
            // If the category exists, update its price
            existing.price = price;
            await existing.save();
            return res.json({ success: true, message: 'price updated' });
        } else {  // If the category does not exist, create a new one
            const newCategory = new collection({
                title,
                price,
            });
            await newCategory.save();
            res.json({ success: true, message: "Category added "});
    	}

	} catch (error) {
		console.error("Error adding category:", error);
		res.status(500).json({ success: false, message: "Server error with  adding category" });
	}
};
	

exports.Categories = async (req, res) => {
	try{
		const existingcategory = await collection.find()
		if(!existingcategory){
			return res
			.status(401)
			.json({ success: false, message: 'No Categories' });
		}
		res.json({ success: true, message: "Category fetched", existingcategory});

	} catch (error) {
		console.error("Error fetching category:", error);
		res.status(500).json({ success: false, message: "Server error with  fetching category" });
	}
};

exports.shopStatus = async (req, res) => {
	try{
		const status = await Shop.find({})
        const Status =status
		res.json({ success: true, message: "Status Fetched", Status});

	} catch (error) {
		console.error("Error fetching category:", error);
		res.status(500).json({ success: false, message: "Server error with  fetching category" });
	}
};

exports.GetRecords = async (req, res) => {
	try{
		const record = await records.find({})
		res.json({ success: true, record});

	} catch (error) {
		console.error("Error fetching Records:", error);
		res.status(500).json({ success: false, message: "Server error with  fetching Records" });
	}
};

exports.updateRecords = async (req, res) => {
  try {
    const bookedSlots = await TimeSlot.find({ isBooked: true })
    const Time = await Shop.find({})

    // Create a new record for the day with the booked slots
    const newRecord = new records({
      BookedSlots: bookedSlots.map(slot => ({
        slot: slot.slot,
        selectedCategory: slot.selectedCategory,
        bookedBy:  slot.bookedBy
      })),
    openingTime : Time[0].openingTime,
    closingTime: Time[0].closingTime
    });

    // Save the record in the database
    await newRecord.save();
    res.json({ message: 'Records updated successfully'});
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
