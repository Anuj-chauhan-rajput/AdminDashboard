const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    f_Id: { type: String, required: true, unique: true }, // Unique ID
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    designation: { type: String, required: true },
    gender: { type: String, required: true },
    courses: { type: [String], required: true },  // Changed to array of strings
    image: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
