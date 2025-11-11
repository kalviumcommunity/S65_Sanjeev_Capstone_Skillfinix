const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT;
const authRoutes = require('./routes/authroute');
const connectdb = require('./lib/db');
const userRoutes = require('./routes/userroute');
const chatRoutes = require('./routes/chatroute');

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/chat",chatRoutes)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectdb();
})