require('dotenv').config();
const express = require("express");
const logger = require("./middleware/logger");
const connectDB = require("./config/db");
const errorHandler = require('./middleware/errorHandler');
const reqinfo = require('./middleware/reqinfo');
const app = express();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require("./routes/userRoute");
const driverRoutes = require("./routes/driverRoutes");



// middleWare

app.use(express.json());
app.use(logger);
app.use(reqinfo);

app.use('/api/auth', authRoutes);
app.use('/api/',userRoutes);
app.use("/api/drivers", driverRoutes);

connectDB();

// for wrong routes 
app.use((req,res,next)=>{
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    })
})

app.use(errorHandler);
const port =8080;
app.listen(port,()=>{
    console.log(`listening to port ${port}.....!`);
    
})