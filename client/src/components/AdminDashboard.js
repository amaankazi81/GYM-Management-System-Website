import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMember, getMembers, deleteMember , updateMember, getMemberByEmail, sendNotification, exportMembers, addSupplement, getSupplements, assignDietPlan} from '../api';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

function AdminDashboard() {
    const [members, setMembers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [joiningDate, setJoiningDate] = useState('');
    const [feesPaid, setFees] = useState('');  
    const [membershipStatus, setMembershipStatus] = useState('');
    const [amount, setAmount] = useState('');
    const [dateIssued, setDateIssued] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [feePackage, setFeePackage] = useState('Monthly');
    const [editMode, setEditMode] = useState(false);  
    const [currentMemberEmail, setCurrentMemberEmail] = useState(null);
    const [searchEmail, setSearchEmail] = useState('');  
    const [searchedMember, setSearchedMember] = useState(null);
    const [noMemberFound, setNoMemberFound] = useState(false);
    const [supplementName, setSupplementName] = useState('');
    const [supplementPrice, setSupplementPrice] = useState('');
    const [supplements, setSupplements] = useState([]);
    const [dietPlan, setDietPlan] = useState('');
    const [currentPage, setCurrentPage] = useState(1); 
    const [membersPerPage] = useState(5);
    const [successMessage, setSuccessMessage] = useState('');

    //Fetching Members
    useEffect(() => {
        async function fetchMembers() {
            const response = await getMembers();
            setMembers(response.data);
        }
        fetchMembers();
    }, []);

    //Fetching Supplements
    useEffect(() => {
        async function fetchSupplements() {
            const response = await getSupplements();
            setSupplements(response.data);
        }
        fetchSupplements();
    }, []);


    const indexOfLastMember = currentPage * membersPerPage;
    const indexOfFirstMember = indexOfLastMember - membersPerPage;
    const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Add pagination buttons dynamically
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(members.length / membersPerPage); i++) {
        pageNumbers.push(i);
    }

    const showMessage = (message) => {
        setSuccessMessage(message);
        setTimeout(() => {
            setSuccessMessage(''); 
        }, 10000);
    };

    //Adding Members
    const handleAddMember = async () => {
        if (editMode){
            await handleUpdateMember()
        } else{
        try {
            await addMember(name, email, contact, joiningDate, membershipStatus,  feesPaid, amount, dateIssued, dueDate, feePackage);
            showMessage('Member Added successfully!');
            setName('');
            setEmail('');
            setContact('');
            setJoiningDate('');
            setMembershipStatus('');
            setFees('');
            setAmount('');
            setDateIssued('');
            setDueDate('');
            setFeePackage('Monthly');
            alert('Member Added Successfully')
        } catch (error) {
            console.error('Error adding member', error);
        }
        }
    };

    //Updating Members
    const handleEditMember = (member) => {
        setEditMode(true);  
        setCurrentMemberEmail(member.email);
        setName(member.name);
        setEmail(member.email);
        setContact(member.contact);
        setMembershipStatus(member.membershipStatus);
        setJoiningDate(member.joiningDate);
        setFees(member.feesPaid);
        setDateIssued(member.dateIssued);
        setAmount(member.amount);
        setDueDate(member.dueDate);
        setFeePackage(member.feePackage);
    };

    const handleUpdateMember = async () => {
        try {
            const updatedMember = {
                name,
                email,
                contact,
                membershipStatus,
                joiningDate,
                feesPaid,
                amount,
                dateIssued,
                dueDate,
                feePackage : feePackage || 'Monthly',
            };
            await updateMember(currentMemberEmail, updatedMember);  
            showMessage('Member Updated successfully!');
            setEditMode(false);  
            setCurrentMemberEmail(null);  
            setName('');
            setEmail('');
            setContact('');
            setMembershipStatus('');
            setJoiningDate('');
            setFees('');
            setAmount('');
            setDateIssued('');
            setDueDate('');
            setFeePackage('Monthly');
            alert('Member Updated Successfully');
        } catch (error) {
            console.error('Error updating member:', error);
        }
    };

    //Deleting Members
    const handleDeleteMember = async (email) => {
        try {
            await deleteMember(email); 
            showMessage('Member Deleted successfully!');
            alert('Member Deleted Successflly')
            setMembers(members.filter((member) => member.email !== email));
        } catch (error) {
            console.error('Error deleting member:', error);
        }
    };  

    //Serching Members based on Email
    const handleSearchMember = async () => {
        try {
            const response = await getMemberByEmail(searchEmail);
            if (response.data) {
                setSearchedMember(response.data);  
                setNoMemberFound(false);  
            } else {
                setSearchedMember(null);
                setNoMemberFound(true);  
            }
        } catch (error) {
            console.error('Error searching member:', error);
            setSearchedMember(null);
            setNoMemberFound(true);  
        }
    };

    //Sending Fee Reminder Notification 
    const handleSendNotification = async (email) => {
        const notificationTitle = "Monthly Fee Reminder";
        const notificationBody = `Dear Member, it's time to pay your gym fee.`;
        try {
            await sendNotification(email, notificationTitle, notificationBody);
            alert('Notification sent Successfully!');
        } catch (error) {
            console.error('Error sending notification:', error);
            alert('Failed to send notification');
        }
    };

    // The API call to send a notification to Firestore Database
    const sendNotification = async (email, title, body) => {
    const response = await axios.post('http://localhost:5000/api/send-notification', {
        email,
        notificationTitle: title,
        notificationBody: body,
        });
            return response.data; 
    };

    //Downloading Members list
    const handleExportMembers = async () => {
        try {
            const response = await exportMembers();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'members.csv');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error exporting members:', error);
        }
    };

    //Adding Supplements 
    const handleAddSupplement = async () => {
        try {
            await addSupplement(supplementName, supplementPrice);
            setSupplementName('');
            setSupplementPrice('');
            alert('Supplement Added Successfully');
        } catch (error) {
            console.error('Error adding supplement:', error);
        }
    };

    //Assigning Diet
    const handleAssignDietPlan = async (email) => {
        try {
            console.log("Assigning Diet Plan:", dietPlan); 
            await assignDietPlan(email, dietPlan);
            setDietPlan('');
            alert('Diet Assign Successfully')
        } catch (error) {
            console.error('Error assigning diet plan:', error);
        }
    };

    return (
        <div className='admin'>
            <Header/>
            <div className="ad"><h2>Admin Dashboard</h2>
            <h3>Welcome, GYM Admin!!</h3>
            </div>
            <div>
            {successMessage && <div className="success-message"><h3>{successMessage}</h3></div>}
            </div>
            <div className="info">
            <div className="ibox" id='addmember'>
            <h3>Add Member / Edit Member</h3>
            <input type="text" placeholder='Member Name' value={name} onChange={(e) => setName(e.target.value)} /> <br />
            <input type="email" placeholder='Member Email'  value={email} onChange={(e) => setEmail(e.target.value)} /> <br />
            <input type="number" placeholder='Member Contact'  value={contact} onChange={(e) => setContact(e.target.value)} /> <br />
            <input type="" placeholder='Joining Date' value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} /> <br />
            <input type="text" placeholder='Membership Status' value={membershipStatus} onChange={(e) => setMembershipStatus(e.target.value)}/> <br />
            <input type="text" placeholder='Fees' value={feesPaid} onChange={(e) => setFees(e.target.value)}/> <br />
            <input type="number" placeholder='Amount Paid' value={amount} onChange={(e) => setAmount(e.target.value)} /> <br />
            <input type="" placeholder='Date Issued' value={dateIssued} onChange={(e) => setDateIssued(e.target.value)} /> <br />
            <input type="" placeholder='Due Date' value={dueDate} onChange={(e) => setDueDate(e.target.value)} /> <br />
            <label htmlFor="">Fee Package : </label>
            <select id="feePackage" value={feePackage} onChange={(e) => setFeePackage(e.target.value)} >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
            </select> <br /> <br />
            <button onClick={handleAddMember}>Add Member</button>
            </div>
             <br />


            <div className="ibox" id='searchmember'>
            <h3>Search Member by Email</h3>
            <h4>Search Member, Edit, Delete, Remind Fee and Assign Diet Plan too!!</h4>
            <input 
                type="email" 
                placeholder="Enter Email to search" 
                value={searchEmail} 
                onChange={(e) => setSearchEmail(e.target.value)} 
                />
            <button onClick={handleSearchMember} id='searchbtn'>Search</button>

            {searchedMember && (
                <div>
                    <h3>Search Result:</h3> 
                    <h4>Name: {searchedMember.name}</h4>
                    <h4>Email: {searchedMember.email}</h4>
                    <h4>Contact: {searchedMember.contact}</h4>
                    <h4>Membership Status: {searchedMember.membershipStatus}</h4>
                    <h4>Fee Package: {searchedMember.feePackage}</h4>
                    <h4>Amount Paid: {searchedMember.amount}</h4>
                    <h4>Date Issued: {searchedMember.dateIssued}</h4>
                    <h4>Due Date: {searchedMember.dueDate} </h4>
                    <h4>Joining Date: {searchedMember.joiningDate}</h4>
                    <button id='embtn' onClick={() => handleEditMember(searchedMember)}>Edit</button> <br />
                    <button id='dmbtn' onClick={() => handleDeleteMember(searchedMember.id)}>Delete Member</button>
                    <button onClick={()=>handleSendNotification(searchedMember.email)}>Send Fee Reminder Notification</button> <br />
                    <input type="text" placeholder="Assign Diet Plan" value={dietPlan} onChange={(e) => setDietPlan(e.target.value)} /> <br />
                    <button onClick={() => handleAssignDietPlan(searchedMember.email)}>Assign Diet Plan</button>
                </div>
            )}
                

            {noMemberFound && (
                        <div>
                            <h3>No members found with the email "{searchEmail}"</h3>
                        </div>
                    )}

            </div>


            <div className="ibox" id='addsupplement'>
                <h3>Supplements</h3>
            <input type="text" placeholder="Supplement Name" value={supplementName} onChange={(e) => setSupplementName(e.target.value)} />
            <input type="text" placeholder="Supplement Price" value={supplementPrice} onChange={(e) => setSupplementPrice(e.target.value)} /> <br />
            <button onClick={handleAddSupplement}>Add Supplement</button>
            <p>Contact to Order Supplement</p>
            <ul>
            {supplements.map((supplement) => (
                <ul>
                    <h4><li>{supplement.name} - {supplement.price} Rs</li></h4>
                </ul>
            ))}
            </ul>
            </div>


            </div>
                <br />
                <div className="dwnldmbr">
                    <h3>To Download Member List Click on the Button  </h3>
                    <button onClick={handleExportMembers}>Download</button>
                    </div>
                <br />

            <h2 id='heading'>Members List</h2>
            <div className="mbrlist">
            <ol type='1'>
                {currentMembers.map((member) => (
                    <li key={member.id}> <h4>Name: {member.name}</h4> <h4>Email: {member.email}</h4>  <h4>Contact: {member.contact}</h4>  <h4>Membership Status : {member.membershipStatus}</h4>  <h4>Joining Date : {member.joiningDate}</h4>
                    </li>
                ))}
                <div className="pagination">
                {pageNumbers.map((number) => (
                    <button key={number} onClick={() => paginate(number)} className={currentPage === number ? 'active' : ''}>
                        {number}
                    </button>
                ))}
            </div>
            </ol>            
            </div>


            <Footer/>
        </div>
    );
}


export default AdminDashboard;
