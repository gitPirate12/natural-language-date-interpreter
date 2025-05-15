import express from "express";
import cors from "cors";
import "dotenv/config";
import interpreterRoutes from "./routes/interpreter.js"; 

const app = express();
const port = process.env.PORT || 3000; 
// middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/requests", interpreterRoutes);

//  Error handling for the server startup
const server = app.listen(port, () => {
  console.log(`Listening for requests on port ${port}`);
});

server.on('error', (error) => {
  console.error("Error starting the server:", error);
});
