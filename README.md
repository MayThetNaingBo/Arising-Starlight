# Arising Starlight CCA Management System

A full-stack web application developed to streamline the management of CCA (Co-Curricular Activity) events, member registration, attendance, notifications, and communication between administrators and members.

## Overview

Arising Starlight is a centralized platform that allows CCA administrators to manage members and events while providing members with a simple interface to register for activities, receive notifications, and stay updated with club information.

The system includes role-based access control, event registration workflows, approval management, feedback handling, email onboarding, and real-time notification features.

## Features

### Public Features

- View CCA information
- Browse upcoming events
- View member directory
- Contact the organization through feedback forms

### Member Features

- Secure member login
- Profile management
- View assigned events
- Request event registration
- Receive event approval/rejection notifications
- Receive event assignment notifications

### Administrator Features

- Administrator authentication
- Member management (Create, Update, Delete)
- Event management (Create, Update, Delete)
- Assign members to events
- Review event registration requests
- Approve or reject registrations
- Manage feedback submissions
- Notification management dashboard


## Technology Stack

### Frontend

- React
- React Router
- Bootstrap
- CSS3

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas
- Mongoose

### Authentication

- Firebase Authentication
- bcrypt password hashing

### Email Services

- Resend

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas


## Event Registration Workflow

1. Member submits registration request.
2. Admin receives notification.
3. Admin reviews request.
4. Request is approved or rejected.
5. Member receives notification.
6. Event participation status is updated.



## Installation

### Clone Repository

```bash
git clone https://github.com/MayThetNaingBo/Arising-Starlight.git
cd arising-starlight
```

### Environment Variables

Copy `.env.example` to `.env` in both server and client folders and fill in your own values.


### Backend Setup

```bash
cd server
npm install
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Demo


## Future Improvements

* Real-time notifications using Socket.IO
* Attendance tracking system
* Event check-in QR codes
* Role-based permissions
* Analytics dashboard
* Mobile responsive redesign
* Calendar integration
* Email notification templates

## Author

**May Thet Naing Bo**<br>
Diploma in Information Technology<br>
Temasek Polytechnic<br>
🌐 https://maythetnaingbo.com
