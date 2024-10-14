import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login'; 
import AdminDashboard from './components/AdminDashboard'; 
import MemberDashboard from './components/MemberDashboard'; 
import HomePage from './components/HomePage';
import '../src/CSS/homepage.css'
import '../src/CSS/login.css'
import '../src/CSS/footer.css'
import '../src/CSS/admin.css'
import '../src/CSS/member.css'


function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<HomePage/> }/>
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/member" element={<MemberDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
