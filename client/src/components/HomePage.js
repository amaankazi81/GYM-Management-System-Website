import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import logo from './gl-logo.png'

function HomePage() {
    const navigate = useNavigate();

    // Redirects to the login page
    const handleLoginClick = () => {
        navigate('/login');  
    };

    return (
        <div className='homepage'>
            <div className="hz"> <h1>HEALTHZONE GYM</h1> <span><img src={logo} alt="logo" /></span> </div>
            <div className="main">
            <div className="h"><h1>Welcome to HEALTHZONE GYM</h1></div>
            <h2 id='lh2'>A Zone to Rebuild Yourself</h2>
            <div className="p"><p>We Provide a Friendly, Welcoming Atmosphere for All Members of All Fitness Levels. The fitness facility for all of your needs, The HEALTHZONE GYM, the Best gym. We also provide and help you in maintaining your Diet .</p></div>
            <h2 id='lh2'>Login to get your details Admin/Member</h2>
            <button onClick={handleLoginClick}>
                Login
            </button>
            </div>
            <Footer/>
        </div>
    );
}


export default HomePage