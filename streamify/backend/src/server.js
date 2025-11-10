const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT;
const authRoutes = require('./routes/authroute');
const connectdb = require('./lib/db');
const userRoutes = require('./routes/userroute');

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectdb();
})