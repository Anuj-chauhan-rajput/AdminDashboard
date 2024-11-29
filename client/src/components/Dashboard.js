import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeForm from './EmployeeForm';
import UpdateEmployee from './UpdateEmployee';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import NetworkChart from './AI map';

const Dashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');
    const [showEmployeeList, setShowEmployeeList] = useState(false);
    const [showEmployeeForm, setShowEmployeeForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [username, setUsername] = useState('');
    const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
    const [currentPage, setCurrentPage] = useState('Dashboard');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    // Fetch employees from the server
    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/employees/list');
            const sortedEmployees = response.data.employees.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by creation date, most recent first
            setEmployees(sortedEmployees);
        } catch (error) {
            setMessage('Error fetching employees');
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Handle delete action
    const handleDelete = async (id) => {
        try {
            console.log(`Attempting to delete employee with ID: ${id}`);
            const response = await axios.delete(`http://localhost:5000/api/employees/delete/${id}`);
    
            if (response.data.message === 'Employee deleted successfully') {
                setMessage('Employee deleted successfully');
                fetchEmployees();  // Refresh the employee list after deletion
            } else {
                setMessage('Failed to delete employee');
            }
        } catch (error) {
            console.error('Error deleting employee:', error.response ? error.response.data : error.message);
            setMessage('Error deleting employee');
        }
    };

    // Handle edit action
    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setShowEmployeeList(false);
        setShowEmployeeForm(false);
        setShowUpdateForm(true);
        setMessage('');
    };

    // Handle navigation
    const handleNavigationClick = (view) => {
        setShowWelcomeMessage(false);
        setCurrentPage(view);

        if (view === 'list') {
            setShowEmployeeList(true);
            setShowEmployeeForm(false);
            setShowUpdateForm(false);
        } else if (view === 'create') {
            setShowEmployeeForm(true);
            setShowEmployeeList(false);
            setShowUpdateForm(false);
        } else {
            setShowEmployeeList(false);
            setShowEmployeeForm(false);
            setShowUpdateForm(false);
        }
    };

    // Search filter
    const filteredEmployees = employees.filter((employee) => {
        return (
            employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.designation.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="dashboard-container">
            {/* Header and Navigation */}
            <header className="dashboard-header">
                <div className="logo">
                    <h2>Admin Dashboard</h2>
                </div>
                <nav>
                    <ul>
                        <li><Link to="/dashboard" onClick={() => handleNavigationClick('dashboard')}>Home</Link></li>
                        <li><Link to="#" onClick={() => handleNavigationClick('list')}>Employee List</Link></li>
                        <li><Link to="#" onClick={() => handleNavigationClick('create')}>Create Employee</Link></li>
                        <li><span>{username}</span></li>
                        <li><Link to="/">Logout</Link></li>
                    </ul>
                </nav>
            </header>

            {/* NetworkChart (AI map) Section */}
            {currentPage === 'Dashboard' && (
                <div className="network-chart-section">
                    <div className="welcome-message">
                        {showWelcomeMessage && <p>Welcome Admin Panel</p>}
                    </div>
                    <NetworkChart />
                </div>
            )}

            {/* Employee List Section */}
            {showEmployeeList && (
                <div className="employee-list-section">
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <p>Total Employees: {filteredEmployees.length}</p>
                    {message && <p>{message}</p>}

                    <div className="employee-list">
                        {filteredEmployees.length > 0 ? (
                            <table className="employee-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Mobile</th>
                                        <th>Designation</th>
                                        <th>Courses</th>
                                        <th>Gender</th>
                                        <th>Created At</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEmployees.map((employee) => (
                                        <tr key={employee._id}> {/* Use _id for delete and edit */}
                                            <td>{employee._id}</td> {/* Display _id */}
                                            <td>
                                                <img 
                                                    src={employee.image ? employee.image : '/path/to/default-image.jpg'} 
                                                    alt="Employee" 
                                                    style={{ width: '30px', height: '30px', borderRadius: '5%', objectFit: 'cover' }}
                                                />
                                            </td>
                                            <td>{employee.name}</td>
                                            <td>{employee.email}</td>
                                            <td>{employee.mobile}</td>
                                            <td>{employee.designation}</td>
                                            <td>{employee.courses && Array.isArray(employee.courses) ? employee.courses.join(', ') : employee.courses}</td>
                                            <td>{employee.gender}</td>
                                            <td>{new Date(employee.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                                            <td>
                                                <button onClick={() => handleDelete(employee._id)}>Delete</button>
                                                <button onClick={() => handleEdit(employee)}>Update</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No employees found.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Create Employee Section */}
            {showEmployeeForm && (
                <div className="employee-form-section">
                    <h2>Create Employee</h2>
                    <EmployeeForm onSuccess={() => { setShowEmployeeList(true); setShowEmployeeForm(false); fetchEmployees(); }} />
                </div>
            )}

            {/* Update Employee Section */}
            {showUpdateForm && selectedEmployee && (
                <div className="update-employee-section">
                    <h2>Update Employee</h2>
                    <UpdateEmployee
                        employee={selectedEmployee}
                        onUpdate={() => { setShowEmployeeList(true); setShowUpdateForm(false); fetchEmployees(); }}
                    />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
