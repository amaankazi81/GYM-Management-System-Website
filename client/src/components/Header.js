import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/header.css'
import logo from './gl-logo.png'

function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userToken'); 
        navigate('/login');
    };

    return (
        <header className='head'>
            <div className="hl"><span><img src={logo} alt="" /></span> <h1>HEALTHZONE GYM</h1></div>
            <div className="dav"><nav > 
                <span id='hm'><Link to="/"  ><p>Home</p></Link> </span> 
                <button onClick={handleLogout} >Logout</button>
            </nav></div>
        </header>
    );
}



export default Header;
