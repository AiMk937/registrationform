const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const port = process.env.PORT || 3001;

// Load environment variables from .env file
require('dotenv').config();

// Serve static files from the "pages" directory
app.use(express.static(path.join(__dirname, "pages")));

// MongoDB connection credentials
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

console.log('MongoDB Username:', username);
console.log('MongoDB Password:', password);
const url = `mongodb+srv://aimaanjkhaan:0hYFGXriBuzHEOk2@cluster1.1ycsg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`

// Connect to MongoDB
mongoose.connect(url, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Define the schema and model for registration
const registrationSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String,
    gender: String,
    password: String
});

const Registration = mongoose.model("Registration", registrationSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the HTML file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "index.html"));
});

// Handle form submission
app.post("/register", async (req, res) => {
    try {
        const { name, age, email, gender, password } = req.body;
        const existingUser = await Registration.findOne({email : email});
        if(!existingUser){
            const registrationData = new Registration({
                name,
                age,
                email,
                gender,
                password
            });
            await registrationData.save();
            res.redirect("/successfull");
        }else{
            res.redirect("/error?message=User already exists");
        }
    } catch(error) {
        console.log('Error during registration:', error);
        res.redirect("/error");
    }
});

// Success and error pages
app.get("/successfull", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "successfull.html"));
});

app.get("/error", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "error.html"));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
