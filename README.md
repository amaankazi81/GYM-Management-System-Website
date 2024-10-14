****Gym Management System****

The Gym Management System is a Full-Stack Web Application developed to streamline the management of gym members, supplements, and notifications. The frontend is built using React, HTML, and CSS, while the backend is powered by Node.js and Express. Firestore is used as the database to store and manage admin, member information, supplements, and notifications.


**Features**

Login System: Secure login for both admins and members using email and password.
Admin Dashboard:
Add, search, edit, and delete members.
Send fee reminders via notifications to members.
Assign diet plans to members.
Add and manage supplements.
View all members and download a CSV file of the member list.
Member Dashboard:
View bills and notifications.
Mark notifications as read.


**Project Workflow :**

**Home Page:**

Serves as the landing page of the website.
Redirects users to the login page for further access.

![1](https://github.com/user-attachments/assets/a10ea242-b6a8-4077-86b0-3aa3ef51629c)

![2](https://github.com/user-attachments/assets/48f44c7f-cfff-4d5b-88d3-51381841b482)


**Login Page:**

Users (admin or member) log in using their email and password.
Based on their role, they are directed to either the admin page or member page.

![3](https://github.com/user-attachments/assets/c096ae49-552f-4f13-8652-c61d5370e27f)


**Admin Page:**

After login, the admin can add members, search for a member by email, view and edit member details, delete a member, and send notifications.
Admins can also add supplements and view all available supplements.

![4](https://github.com/user-attachments/assets/8cd58e5a-3d7a-4412-a8a0-fdeed7740453)

![8](https://github.com/user-attachments/assets/bf0d1b72-75f3-4a14-a3ee-96ba64bb7e5f)

There's a feature to view all members and download a CSV file of the members' list for record-keeping.

![5](https://github.com/user-attachments/assets/368a6a5d-505b-48d5-85a9-a2f8ba8e1556)

![6](https://github.com/user-attachments/assets/c431fdd4-9eb5-485e-a4ac-431e8ffe4476)

![7](https://github.com/user-attachments/assets/984184bb-3f7d-4bc7-80b9-b5bc74399734)


**Member Page:**

Once logged in, members can view their billing information and notifications.
Members have the ability to mark notifications as read for easier management.
![9](https://github.com/user-attachments/assets/8b80835b-6c41-42f1-8710-1452e73da314)
![10](https://github.com/user-attachments/assets/a43ad2e5-cb5e-4162-a6f6-4dc0cd96864c)


**Tech Stack**

*Frontend:* React, HTML, CSS

*Backend:* Node.js, Express

*Database:* Firestore


**Installation and Setup Instructions**

**Note:** You should download your own firebase-admin-sdk.json file from *Service Accout* of Firebase and add it to server folder of the project o else it will show error.

**Clone the repository:**

bash
Copy code
git clone https://github.com/yourusername/gym-management-system.git
cd gym-management-system
Install dependencies for both client and server:

bash:

npm install

cd client

npm install

Start the backend server:

bash:

cd server

npm start

Start the frontend:

bash:

cd client

npm start

Access the application:

Navigate to http://localhost:3000 to view the frontend.
The backend server will run on http://localhost:5000.

**Database Setup**

This project uses Firestore as the database. You will need to set up a Firebase project and configure Firestore to store member, supplement, and notification data. Download firebase-admin-sdk.json file from *Service Account* of Firebase Project Setting and Add it to Server Folder.

**License**

This project is licensed under the MIT License.

