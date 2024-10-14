import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

export const login = (email, password) => api.post('/login', { email, password });
export const addMember = (name, email, contact, joiningDate, membershipStatus,  feesPaid, amount, dateIssued, dueDate, feePackage) => api.post('/add-member', { name, email, contact, joiningDate, membershipStatus,  feesPaid, amount, dateIssued, dueDate, feePackage});
export const updateMember = (email, updatedMember) => api.put(`/update-member/${email}`, updatedMember); 
export const getMembers = () => api.get('/members');
export const getMemberByEmail = (email) => api.get(`/members/${email}`);
export const getBills = (email) => api.get(`/bills/${email}`);
export const deleteMember =  (email) => api.delete(`/delete-member/${email}`);
export const sendNotification = (email, notificationTitle, notificationBody) => api.post('/send-notification', { email, notificationTitle, notificationBody });
export const exportMembers = () => api.get('/export-members', { responseType: 'blob' });
export const addSupplement = (name, price) => api.post('/add-supplement', { name, price });
export const getSupplements = () => api.get('/supplements');
export const assignDietPlan = (email, dietPlan) => api.post(`/assign-diet-plan/${email}`, {dietPlan});
export const getBillNotifications = (email) => api.get(`/member-notifications/${email}`);
export const markNotificationAsRead = async (notificationId) => {
    try {
        const response = await api.put(`/notifications/${notificationId}`, {
            isRead: true, 
        });
        return response.data; 
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error; 
    }
};

export default api;
