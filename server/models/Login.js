// models/Login.js
const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    f_sno: {
        type: String,
        required: true,
    },
    f_userName: {
        type: String,
        required: true,
        unique: true,
    },
    f_Pwd: {
        type: String,
        required: true,
    },
});

const Login = mongoose.models.Login || mongoose.model('Login', loginSchema);

module.exports = Login;
