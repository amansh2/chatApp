const mongoose = require('mongoose');
require('dotenv').config();
const dbConnect = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("MongoDB Connected successfully"))
    .catch((error) => console.log("Database connection error:", error));
};

module.exports = dbConnect;
