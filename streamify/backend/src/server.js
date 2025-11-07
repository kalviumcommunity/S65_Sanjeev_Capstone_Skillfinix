const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT;
const authRoutes = require('./routes/authroute');
const connectdb = require('./lib/db');
app.use(express.json());
app.use("/api/auth",authRoutes)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectdb();
})