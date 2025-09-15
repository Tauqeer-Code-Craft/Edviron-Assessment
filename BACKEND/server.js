const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");

connectDB();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(PORT,()=>{
    console.log(`Server is Running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle  unhandled promise rejections
process.on("unhandledRejection",(err)=>{
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(()=> process.exit(1));
});

// Handle detected exception
process.on("uncaughtException",(err)=>{
    console.error(`Undetected Exception: ${err.message}`);
   process.exit(1); 
});