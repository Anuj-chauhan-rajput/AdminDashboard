import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, FormControl, FormLabel, MenuItem, Select, FormControlLabel, Radio, RadioGroup, Checkbox, FormHelperText } from '@mui/material';

const EmployeeForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        courses: [],
        image: null,
    });

    const [message, setMessage] = useState('');
    const [imageError, setImageError] = useState('');
    const [mobileError, setMobileError] = useState(''); // To handle mobile number validation

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData((prevData) => ({
                ...prevData,
                courses: checked
                    ? [...prevData.courses, value]
                    : prevData.courses.filter((course) => course !== value),
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }

        // Mobile validation logic (only numbers allowed)
        if (name === 'mobile') {
            const regex = /^[0-9]*$/; // Regex to allow only numbers
            if (!regex.test(value)) {
                setMobileError('Please enter a valid mobile number (only numbers are allowed).');
            } else {
                setMobileError(''); // Clear error if valid number
            }
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setImageError('');
            setFormData({ ...formData, image: file });
        } else {
            setImageError('Please upload a valid image (JPG or PNG only).');
            setFormData({ ...formData, image: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitData = new FormData();

        for (let key in formData) {
            if (key === 'courses') {
                formData[key].forEach((course) => submitData.append('courses[]', course));
            } else if (key === 'image' && formData.image) {
                submitData.append('image', formData.image);
            } else {
                submitData.append(key, formData[key]);
            }
        }

        try {
            const response = await axios.post('http://localhost:5000/api/employees/create', submitData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage(response.data.message);
            setFormData({
                name: '',
                email: '',
                mobile: '',
                designation: '',
                gender: '',
                courses: [],
                image: null,
            });
            // Call onSuccess with the new employee data
            onSuccess(response.data.newEmployee); // Assuming `newEmployee` is returned from the server
        } catch (error) {
            setMessage(`Error: ${error.response?.data?.error || 'Something went wrong.'}`);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>Create Employee</Typography>
            <form onSubmit={handleSubmit}>
                {/* Name Field */}
                <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                />

                {/* Email Field */}
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email"
                    margin="normal"
                    required
                />

                {/* Mobile Field */}
                <TextField
                    fullWidth
                    label="Mobile No"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    type="text"
                    margin="normal"
                    required
                    inputProps={{
                        maxLength: 10, // Optional: limit input length
                    }}
                    helperText={mobileError || 'Enter only numbers (max 10 digits)'}
                    error={!!mobileError}
                />

                {/* Designation Dropdown */}
                <FormControl fullWidth margin="normal">
                    <FormLabel>Designation</FormLabel>
                    <Select
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        required
                    >
                        <MenuItem value="HR">HR</MenuItem>
                        <MenuItem value="Sales">Sales</MenuItem>
                        <MenuItem value="Manager">Manager</MenuItem>
                    </Select>
                </FormControl>

                {/* Gender Radio Buttons */}
                <FormControl component="fieldset" margin="normal">
                    <FormLabel component="legend">Gender</FormLabel>
                    <RadioGroup row name="gender" value={formData.gender} onChange={handleInputChange}>
                        <FormControlLabel value="Male" control={<Radio />} label="Male" />
                        <FormControlLabel value="Female" control={<Radio />} label="Female" />
                    </RadioGroup>
                </FormControl>

                {/* Courses - Checkboxes */}
                <FormControl component="fieldset" margin="normal">
                    <FormLabel component="legend">Courses</FormLabel>
                    <FormControlLabel
                        control={<Checkbox name="courses" value="MCA" checked={formData.courses.includes('MCA')} onChange={handleInputChange} />}
                        label="MCA"
                    />
                    <FormControlLabel
                        control={<Checkbox name="courses" value="BCA" checked={formData.courses.includes('BCA')} onChange={handleInputChange} />}
                        label="BCA"
                    />
                    <FormControlLabel
                        control={<Checkbox name="courses" value="BSC" checked={formData.courses.includes('BSC')} onChange={handleInputChange} />}
                        label="BSC"
                    />
                </FormControl>

                {/* Image Upload with Validation */}
                <input
                    type="file"
                    name="image"
                    accept=".jpg,.png"
                    onChange={handleImageChange}
                    style={{ marginTop: '16px' }}
                />
                {imageError && <FormHelperText error>{imageError}</FormHelperText>}

                {/* Submit Button */}
                <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }} disabled={mobileError}>
                    Submit
                </Button>

                {/* Error or Success Message */}
                {message && <Typography color="secondary" sx={{ mt: 2 }}>{message}</Typography>}
            </form>
        </Container>
    );
};

export default EmployeeForm;
