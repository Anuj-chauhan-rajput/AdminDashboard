// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';





function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employeeform" element={<EmployeeForm />} />
        <Route path="/employeelist" element={<EmployeeList />} />




      </Routes>

    </div>
  );
}

export default App;



