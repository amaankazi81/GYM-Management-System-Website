import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';    
import { getBills, getBillNotifications, markNotificationAsRead } from '../api';
import Header from './Header';
import Footer from './Footer';

function MemberDashboard() {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [noNotifications, setNoNotifications] = useState(false);
    const [noBills, setNoBills] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setEmail(currentUser.email);
                setLoading(false); 
            } else {
                setError('User is not logged in');
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!email) return;

        async function fetchBills() {
            try {
                setLoading(true);
                const response = await getBills(email);
                if (response.data.members.length > 0) {
                    setBills(response.data.members);  
                    setNoBills(false);
                } else {
                    setNoBills(true);
                }
            } catch (err) {
                setError('Error fetching bills');
                console.error('Error fetching bills:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchBills();
    }, [email]);

    useEffect(() => {
        if (!email) return;
        async function fetchNotifications() {
            try {
                const response = await getBillNotifications(email);
                if (response?.data?.length > 0) {
                    setNotifications(response.data);
                    setNoNotifications(false);
                } else {
                    setNoNotifications(true);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        }
        fetchNotifications();
    }, [email]);

    const markAsRead = async (notificationId) => {
        try {
            await markNotificationAsRead(notificationId);
            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification.id === notificationId
                        ? { ...notification, isRead: true }
                        : notification
                )
            );
            const unreadNotifications = notifications.some(notification => !notification.isRead);
            if (!unreadNotifications) {
                setNoNotifications(true);
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }   
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }


    return (
        <div className='member'>
            <Header />
            <h2>Member Dashboard</h2>
            <h3>Welcome! Healthzone Member</h3>

            <h3>Your Bill</h3>
            <div className="bill">
                <ul>
                    {bills.length > 0 ? (
                        bills.map((bill) => (
                            <li key={bill.id}>
                                <li><div><strong>Name:</strong> {bill.name}</div></li>
                                <li><div><strong>Email:</strong> {bill.email}</div></li>
                                <li><div><strong>Contact:</strong> {bill.contact}</div></li>
                                <li><div><strong>Amount Paid:</strong> {bill.amount}</div></li>
                                <li><div><strong>Issued Date:</strong> {bill.dateIssued}</div></li>
                                <li><div><strong>Joining Date:</strong> {bill.joiningDate}</div></li>
                                <li><div><strong>Membership Status:</strong> {bill.membershipStatus}</div></li>
                                <li><div><strong>Due Date:</strong> {bill.dueDate}</div></li>
                                <li><div><strong>Fee Package:</strong> {bill.feePackage}</div></li>
                                <li><div><strong>Diet Plan:</strong> {bill.dietPlan}</div></li>
                            </li>
                        ))
                    ) : (
                        <div>No Bills Available</div>
                    )}
                </ul>

                <div className="notifications">
                <h3>Your Notifications</h3>
                <ul>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <li key={notification.id}>
                                <strong>{notification.notificationTitle}</strong>: {notification.notificationBody} <br />
                                <em>{notification.timestamp ? new Date(notification.timestamp.seconds * 1000).toLocaleString() : ''}</em>
                                {!notification.isRead && (
                                    <button onClick={() => markAsRead(notification.id)}>Mark as Read</button>
                                )}
                            </li>
                        ))
                    ) : (
                        noNotifications  ===true ? <div><h4>No Notifications Available</h4></div> : null
                    )}
                </ul>
            </div>

            </div>  
            <Footer />
        </div>
    );
}

export default MemberDashboard;