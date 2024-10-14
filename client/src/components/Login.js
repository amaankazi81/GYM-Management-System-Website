import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Footer from './Footer';
import logo from './gl-logo.png'

        
//Firebase configuration object
const firebaseConfig = {
apiKey: "AIzaSyDlXVth7DyHj940Hf3mwxtbZ0CuurhowV8",
authDomain: "gym-management-system-6b545.firebaseapp.com",
projectId: "gym-management-system-6b545",
storageBucket: "gym-management-system-6b545.appspot.com",
messagingSenderId: "521185880101",
appId: "1:521185880101:web:bf8843ab2cf0e43c8d77cc",
measurementId: "G-T3VMPM81C3",

};
        
//Initialize Firebase app
const app = initializeApp(firebaseConfig);
console.log('Firebase initialized', app);
const auth = getAuth(app);


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            // Sign in using Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken(); 
            console.log('ID Token from Firebase:', idToken);

            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken }),
            });
    
            if (response.ok) {
                const data = await response.json();
                const { uid } = data;
    
                // Navigate based on user role or email
                if (email === "gymadmin@gmail.com" || email === "gymadmin2@gmail.com") {
                    navigate('/admin');
                } else {
                    navigate('/member');
                }
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error('Login Failed', error);
            setError('Invalid email or password');
        }
    };
    
    return (
        <div className='login'>
            <div className="lh"> <h1>HEALTHZONE GYM</h1> <span><img src={logo} alt="logo" /></span> </div>
            <div className="lh2">
            <h2>Login Admin / Member of GYM</h2>
            </div>
            <div className="ln">
            <h1>Login</h1>
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            /> <br />   
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            /> <br />
            <button onClick={handleLogin}>Login</button>

            <div className="err">
            {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Login;


