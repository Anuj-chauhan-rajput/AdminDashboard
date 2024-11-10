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
    const [currentPage, setCurrentPage] = useState('Dashboard'); // Track current page title
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

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/employees/delete/${id}`);
            setMessage(response.data.message);
            fetchEmployees();  // Refresh the list after deletion
        } catch (error) {
            setMessage('Error deleting employee');
        }
    };

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setShowEmployeeList(false);
        setShowEmployeeForm(false);
        setShowUpdateForm(true);
        setMessage('');
    };

    const handleNavigationClick = (view) => {
        // Hide the welcome message after any navigation click
        setShowWelcomeMessage(false);

        // Set the specific view to show and update the page title
        if (view === 'list') {
            setCurrentPage('Employee List');
            setShowEmployeeList(true);
            setShowEmployeeForm(false);
            setShowUpdateForm(false);
        } else if (view === 'create') {
            setCurrentPage('Create Employee');
            setShowEmployeeForm(true);
            setShowEmployeeList(false);
            setShowUpdateForm(false);
        } else {
            setCurrentPage('Dashboard');
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
                    <h2>My Company</h2> {/* Replace this with your logo */}
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
                    {/* Dynamically display page name */}
                    {currentPage === 'Dashboard' && <h1>{currentPage}</h1> 
                }

{showWelcomeMessage && (
                <div className="welcome-message">
                    {/* Dynamically display page name */}
                    {currentPage === 'Dashboard' && <p>Welcome Admin Panel</p>}
                </div>
            )}


                </div>
                
                    <br /><br /><br /><br /><br />
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
                            filteredEmployees.map((employee) => (
                                <div key={employee._id} className="employee-card">
                                    <div className="employee-info">
                                        <div className="employee-id">{employee._id}</div>
                                     
                                        <div className="employee-image">
                                        <img 
    src={employee.image ? employee.image : '/path/to/default-image.jpg'} 
    alt="Employee" 
    style={{ width: '30px', height: '30px', borderRadius: '5%', objectFit: 'cover' }}
/>

                                        </div>





                                        <div className="employee-name">{employee.name}</div>
                                        <div className="employee-email">{employee.email}</div>
                                        <div className="employee-mobile">{employee.mobile}</div>
                                        <div className="employee-designation">{employee.designation}</div>
                                        <div className="employee-course">{employee.courses && Array.isArray(employee.courses) ? employee.courses.join(', ') : employee.courses}</div>
                                        <div className="employee-gender">{employee.gender}</div>
                                        <div className="employee-createdAt">
                                            {new Date(employee.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                            })}
                                        </div>
                                    </div>
                                    <div className="employee-actions">
                                        <button onClick={() => handleDelete(employee._id)}>Delete</button>
                                        <button onClick={() => handleEdit(employee)}>Update</button>
                                    </div>
                                </div>
                            ))
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
