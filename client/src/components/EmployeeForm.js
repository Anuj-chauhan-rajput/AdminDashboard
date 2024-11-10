import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Checkbox, FormControlLabel, Radio, RadioGroup, FormControl, FormLabel, MenuItem, Select } from '@mui/material';

const EmployeeForm = () => {
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
    };

    const handleImageChange = (e) => setFormData({ ...formData, image: e.target.files[0] });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitData = new FormData();
        for (let key in formData) {
            if (key === 'courses') {
                formData[key].forEach(course => submitData.append('courses[]', course));
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
        } catch (error) {
            setMessage(`Error: ${error.response?.data?.error || 'Something went wrong.'}`);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>Create Employee</Typography>
            <form onSubmit={handleSubmit}>
                <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleInputChange} margin="normal" required />
                <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleInputChange} type="email" margin="normal" required />
                <TextField fullWidth label="Mobile No" name="mobile" value={formData.mobile} onChange={handleInputChange} type="text" margin="normal" required />
                <FormControl fullWidth margin="normal">
                    <FormLabel>Designation</FormLabel>
                    <Select name="designation" value={formData.designation} onChange={handleInputChange} required>
                        <MenuItem value="HR">HR</MenuItem>
                        <MenuItem value="Sales">Sales</MenuItem>
                        <MenuItem value="Manager">Manager</MenuItem>
                    </Select>
                </FormControl>
                <FormControl component="fieldset" margin="normal">
                    <FormLabel component="legend">Gender</FormLabel>
                    <RadioGroup row name="gender" value={formData.gender} onChange={handleInputChange}>
                        <FormControlLabel value="Male" control={<Radio />} label="Male" />
                        <FormControlLabel value="Female" control={<Radio />} label="Female" />
                    </RadioGroup>
                </FormControl>
                <FormControl component="fieldset" margin="normal">
                    <FormLabel component="legend">Courses</FormLabel>
                    <FormControlLabel control={<Checkbox name="courses" value="MCA" checked={formData.courses.includes('MCA')} onChange={handleInputChange} />} label="MCA" />
                    <FormControlLabel control={<Checkbox name="courses" value="BCA" checked={formData.courses.includes('BCA')} onChange={handleInputChange} />} label="BCA" />
                    <FormControlLabel control={<Checkbox name="courses" value="BSC" checked={formData.courses.includes('BSC')} onChange={handleInputChange} />} label="BSC" />
                </FormControl>
                <input type="file" name="image" accept=".jpg,.png" onChange={handleImageChange} required />
                <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>Submit</Button>
                {message && <Typography color="secondary" sx={{ mt: 2 }}>{message}</Typography>}
            </form>
        </Container>
    );
};

export default EmployeeForm;
