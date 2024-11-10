import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Checkbox, FormControlLabel, Radio, RadioGroup, FormControl, FormLabel, MenuItem, Select } from '@mui/material';

const UpdateEmployee = ({ employee, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        courses: [],
        image: '',
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (employee) {
            setFormData({
                name: employee.name,
                email: employee.email,
                mobile: employee.mobile,
                designation: employee.designation,
                gender: employee.gender,
                courses: employee.courses,
                image: employee.image,
            });
            setImagePreview(`http://localhost:5000/uploads/${employee.image}`);
        }
    }, [employee]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData((prevData) => ({
                ...prevData,
                courses: checked
                    ? [...prevData.courses, value]
                    : prevData.courses.filter((course) => course !== value),
            }));
        } else if (type === 'file') {
            const file = e.target.files[0];
            setFormData((prevData) => ({
                ...prevData,
                image: file,
            }));
            setImagePreview(URL.createObjectURL(file));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedEmployeeData = new FormData();
        for (let key in formData) {
            if (key === 'courses') {
                formData[key].forEach(course => updatedEmployeeData.append('courses[]', course));
            } else {
                updatedEmployeeData.append(key, formData[key]);
            }
        }

        try {
            const response = await axios.put(
                `http://localhost:5000/api/employees/update/${employee._id}`,
                updatedEmployeeData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            setMessage(response.data.message);
            onUpdate();
        } catch (error) {
            setMessage('Error updating employee data.');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>Edit Employee</Typography>
            <form onSubmit={handleSubmit}>
                <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} type="email" margin="normal" required />
                <TextField fullWidth label="Mobile No" name="mobile" value={formData.mobile} onChange={handleChange} type="text" margin="normal" required />
                <FormControl fullWidth margin="normal">
                    <FormLabel>Designation</FormLabel>
                    <Select name="designation" value={formData.designation} onChange={handleChange} required>
                        <MenuItem value="HR">HR</MenuItem>
                        <MenuItem value="Sales">Sales</MenuItem>
                        <MenuItem value="Manager">Manager</MenuItem>
                    </Select>
                </FormControl>
                <FormControl component="fieldset" margin="normal">
                    <FormLabel component="legend">Gender</FormLabel>
                    <RadioGroup row name="gender" value={formData.gender} onChange={handleChange}>
                        <FormControlLabel value="Male" control={<Radio />} label="Male" />
                        <FormControlLabel value="Female" control={<Radio />} label="Female" />
                    </RadioGroup>
                </FormControl>
                <FormControl component="fieldset" margin="normal">
                    <FormLabel component="legend">Courses</FormLabel>
                    <FormControlLabel control={<Checkbox name="courses" value="MCA" checked={formData.courses.includes('MCA')} onChange={handleChange} />} label="MCA" />
                    <FormControlLabel control={<Checkbox name="courses" value="BCA" checked={formData.courses.includes('BCA')} onChange={handleChange} />} label="BCA" />
                    <FormControlLabel control={<Checkbox name="courses" value="BSC" checked={formData.courses.includes('BSC')} onChange={handleChange} />} label="BSC" />
                </FormControl>
                
                {/* Image File Input */}
                <input type="file" name="image" onChange={handleChange} accept="image/*" style={{ marginTop: '50px' }} />
                
                {/* Image Preview with improved styling */}
                {imagePreview && (
                    <div style={{ marginTop: '15px', textAlign: 'center' }}>
                        <img 
                            src={imagePreview} 
                            alt="Employee" 
                            style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} 
                        />
                    </div>
                )}
                
                <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
                    Update Employee
                </Button>
                {message && <Typography color="secondary" sx={{ mt: 2 }}>{message}</Typography>}
            </form>
        </Container>
    );
};

export default UpdateEmployee;
