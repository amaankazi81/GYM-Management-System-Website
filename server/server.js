const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const { Parser } = require('json2csv');

//Initialize Firebase Admin SDK (backend Firebase services)
const serviceAccount = require('./gym-management-system-6b545-firebase-adminsdk-kd0sa-8b30d028e4.json'); 

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gym-management-system-6b545-default-rtdb.firebaseio.com"
});

const db = admin.firestore();
const auth = admin.auth();
const app = express();
app.use(cors())
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());


// Login 
app.post('/api/login', async (req, res) => {
    const { idToken } = req.body;
    console.log("Received token:", idToken); 
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        res.status(200).send({ message: 'Login successful', uid });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).send({ error: 'Invalid token' });
    }
});


//Adding Members
app.post('/api/add-member', async (req, res) => {
    const { name, email, contact, joiningDate, membershipStatus, feesPaid, amount, dateIssued, dueDate, feePackage} = req.body;
    try {
        const docRef = await db.collection('members').add({
            name,
            email,
            contact,
            joiningDate,
            membershipStatus, 
            feesPaid,
            amount,
            dateIssued, 
            dueDate,
            feePackage
        });
        res.status(200).send({ success: `Member added with ID: ${docRef.id}` });
    } catch (error) {
        res.status(500).send({ error: 'Error adding member' });
    }
});


// Updating Members
app.put('/api/update-member/:email', async (req, res) => {
    const { email } = req.params;
    const { name, email: updatedEmail, contact,joiningDate, membershipStatus, feesPaid, amount, dateIssued, dueDate, feePackage } = req.body;
    try {
        const snapshot = await db.collection('members').where('email', '==', email).get();
        if (snapshot.empty) {
            return res.status(404).send({ error: 'No member found with this email' });
        }
        snapshot.forEach(async (doc) => {
            await db.collection('members').doc(doc.id).update({
                name,
                email: updatedEmail,
                contact,
                joiningDate,
                membershipStatus, 
                feesPaid,
                amount,
                dateIssued, 
                dueDate,
                feePackage
            });
        });
        res.status(200).send({ success: 'Member updated' });
    } catch (error) {
        console.error('Error updating member:', error);  // This logs the error
        res.status(500).send({ error: 'Error updating member' });
    }
});


//Get Member by Email
app.get('/api/members/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const snapshot = await db.collection('members').where('email', '==', email).get();
        if (snapshot.empty) {
            return res.status(404).send({ error: 'No member found with this email' });
        }
        const members = [];
        snapshot.forEach(doc => members.push({ id: doc.id, ...doc.data() }));
        res.status(200).send(members[0]); 
    } catch (error) {
        console.error('Error retrieving member:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});


// Delete Member
app.delete('/api/delete-member/:email', async (req, res) => {
    const { email} = req.params;
    try {
        await db.collection('members').doc(email).delete();
        res.status(200).send({ success: 'Member deleted' });
    } catch (error) {
        res.status(500).send({ error: 'Error deleting member' });
    }
});


//View Members
app.get('/api/members', async (req, res) => {
    try {
        const members = [];
        const snapshot = await db.collection('members').get();
        snapshot.forEach(doc => members.push({ id: doc.id, ...doc.data() }));
        res.status(200).send(members);
    } catch (error) {
        console.log("Error fetching members: ",error)
        res.status(500).send({ error: 'Error retrieving members',error });
    }
});


// Load Bills for a member
app.get('/api/bills/:email', async (req, res) => {
    const { email } = req.params;
    console.log('Received email:', email); 
    try {
        const snapshot = await db.collection('members').where('email', '==', email).get();
        if (snapshot.empty) {
            return res.status(404).send({ error: 'No member found with this email' });
        }
        const members = [];
        snapshot.forEach(doc => members.push({ id: doc.id, ...doc.data() }));
        res.status(200).send({members});
    } catch (error) {
        console.error('Error retrieving bills:', error);  
        res.status(500).send({ error: 'Internal Server Error' });
    }
});


//Sending Notification
app.post('/api/send-notification', async (req, res) => {
    const { email, notificationTitle, notificationBody } = req.body;
    console.log('Notification request received:', req.body);
    try {
        // Store the notification in Firestore
        const newNotification = {
            memberEmail: email,
            notificationTitle: notificationTitle,
            notificationBody: notificationBody,
            createdAt: new Date().toISOString(),
            isRead: false
        };
        await db.collection('notifications').add(newNotification);
        res.status(200).send({ success: 'Notification stored successfully' });
    } catch (error) {
        console.error('Error storing notification:', error);
        res.status(500).send({ error: 'Error storing notification' });
    }
});


// Getting Notifications for member
app.get('/api/member-notifications/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const snapshot = await db.collection('notifications').where('memberEmail', '==', email).get();
        if (snapshot.empty) {
            return res.status(404).send({ error: 'No notifications found for this email' });
        }
        const notifications = [];
        snapshot.forEach(doc => notifications.push({ id: doc.id, ...doc.data() }));
        res.status(200).send(notifications);
    } catch (error) {
        res.status(500).send({ error: 'Error retrieving notifications' });
    }
});


//Export members as CSV
app.get('/api/export-members', async (req, res) => {
    try {
        const members = [];
        const snapshot = await db.collection('members').get();
        snapshot.forEach(doc => members.push({ id: doc.id, ...doc.data() }));
        const fields = ['name', 'email', 'membershipStatus', 'joiningDate', 'feesPaid', 'feePackage', 'amount', 'dateIssued', 'dueDate'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(members);
        res.header('Content-Type', 'text/csv');
        res.attachment('members.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).send({ error: 'Error exporting members' });
    }
});


// Add Supplement
app.post('/api/add-supplement', async (req, res) => {
    const { name, price } = req.body;
    try {
        await db.collection('supplements').add({ name, price });
        res.status(200).send({ success: 'Supplement added' });
    } catch (error) {
        res.status(500).send({ error: 'Error adding supplement' });
    }
});


// Get Supplements
app.get('/api/supplements', async (req, res) => {
    try {
        const supplements = [];
        const snapshot = await db.collection('supplements').get()
        snapshot.forEach(doc => supplements.push({ id: doc.id, ...doc.data() }));
        res.status(200).send(supplements);
    } catch (error) {
        res.status(500).send({ error: 'Error retrieving supplements' });
    }
});


//Add Diet Plan for Member
app.post('/api/assign-diet-plan/:email', async (req, res) => {
    console.log('Request Body:', req.body);
    const { email } = req.params;
    const { dietPlan } = req.body;
    if (!dietPlan) {
        console.log("Diet Plan is Missing")
        return res.status(400).send({ error: 'Diet plan is required' });
    }
    try {
        const snapshot = await db.collection('members').where('email', '==', email).get();
        if (snapshot.empty) {
            return res.status(404).send({ error: 'No member found with this email' });
        }
        snapshot.forEach(async (doc) => {
            await db.collection('members').doc(doc.id).update({
                dietPlan
            });
        });} catch (error) {
        console.error('Error assigning diet plan:', error);
        res.status(500).send({ error: 'Error assigning diet plan', details: error.message });
    }
});


// Marking Notification as Read
app.put('/api/notifications/:id', async (req, res) => {
    const notificationId = req.params.id;
    const { isRead } = req.body;
    try {
        const notificationRef = db.collection('notifications').doc(notificationId);
        await notificationRef.update({ isRead: isRead });
        res.status(200).send({ message: 'Notification updated successfully' });
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).send({ error: 'Error updating notification' });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
