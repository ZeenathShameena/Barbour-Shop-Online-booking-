const express = require('express');
const path = require('path');
require('dotenv').config(); 
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const cookieParser = require("cookie-parser");


const app = express();
app.use(cookieParser());

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors({ 
    origin: "http://localhost:3000", 
    credentials: true }));


const connectDB = require('./config/db');
const authRouter= require('./routers/authroute');
const adminRouter = require('./routers/adminRoute');


connectDB();

app.use('/api/auth', authRouter);
app.use('/api/admin',adminRouter)


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));