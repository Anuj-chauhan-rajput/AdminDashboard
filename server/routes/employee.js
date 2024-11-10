const express = require('express');
const Employee = require('../models/Employee');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Set up file storage for images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');  // Destination folder for storing images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Unique filename
    }
});

const upload = multer({ storage });

// Create a new employee
router.post('/create', upload.single('image'), async (req, res) => {
    try {
        const { name, email, mobile, designation, gender, courses } = req.body;

        if (!name || !email || !mobile || !designation || !gender || !courses) {
            return res.status(400).json({ error: 'All fields are required!' });
        }

        const image = req.file ? req.file.filename : null;
        if (!image) {
            return res.status(400).json({ error: 'Image is required!' });
        }

        const newEmployee = new Employee({
            f_Id: 'EMP' + Date.now(),
            name,
            email,
            mobile,
            designation,
            gender,
            courses: Array.isArray(courses) ? courses : JSON.parse(courses),
            image
        });

        await newEmployee.save();
        res.status(200).json({ message: 'New employee created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all employees
router.get('/list', async (req, res) => {
    try {
        const employees = await Employee.find();
        
        // Map employee data to include the full image path
        const employeesWithImagePaths = employees.map(employee => ({
            ...employee.toObject(),
            image: employee.image ? `http://localhost:5000/uploads/${employee.image}` : null
        }));

        res.status(200).json({ employees: employeesWithImagePaths });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete an employee by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update employee data
router.put('/update/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, email, mobile, designation, gender, courses } = req.body;

        if (!name || !email || !mobile || !designation || !gender || !courses) {
            return res.status(400).json({ error: 'All fields are required!' });
        }

        const updatedData = { 
            name, 
            email, 
            mobile, 
            designation, 
            gender, 
            courses: Array.isArray(courses) ? courses : JSON.parse(courses)
        };

        if (req.file) {
            updatedData.image = req.file.filename;
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json({ message: 'Employee updated successfully', employee: updatedEmployee });
    } catch (error) {
        res.status(500).json({ message: 'Error updating employee', error: error.message });
    }
});

module.exports = router;
