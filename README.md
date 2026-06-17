# Arising Starlight

Arising Starlight is a full-stack CCA club and event management platform designed to streamline member engagement, event organization, registration management, and administrative operations.

The platform provides separate experiences for public users, registered members, and administrators, allowing organizations to efficiently manage events, member information, and communication through a centralized system.

## Features

### Public Users

- View organization information
- Browse upcoming events
- View member information
- Contact organization administrators
- Submit registration requests

### Member Features

- Secure member login
- Member dashboard
- View upcoming events
- View event details
- Manage personal profile
- Contact administrators
- Create account password after approval

### Administrator Features

- Secure admin authentication
- Create events
- Edit events
- Delete events
- Manage member profiles
- Approve registration requests
- Manage organization information
- Manage contact information
- View event participants
- Assign members to events


## Tech Stack

### Frontend

* React
* Vite
* React Router
* Bootstrap
* React Bootstrap
* Axios
* React Icons

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Firebase Admin SDK
* Nodemailer
* Bcrypt

### Services

* Firebase Authentication
* Email Services
* MongoDB Database

## Screenshots

### Home Page
![Home Page](./screenshots/home-page.png)

### Member Dashboard
![Member Dashboard](./screenshots/member-dashboard.png)

### Event Management
![Event Management](./screenshots/manage-events.png)

### Registration Requests
![Registration Requests](./screenshots/registration-requests.png)
```

## Demo

## Demo

![Arising Starlight Demo](./screenshots/demo.gif)


## Installation

### Clone Repository

```bash
git clone https://github.com/MayThetNaingBo/Arising-Starlight.git
cd arising-starlight
```

## Backend Setup

```bash
cd server
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your own values.


Start backend:

```bash
npm run dev
```

Server:

```text
http://localhost:5000
```

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend:

```text
${import.meta.env.VITE_API_URL}
```

## User Roles

### Public User

Can:

* View organization information
* Browse events
* Contact organization
* Submit registration requests

### Member

Can:

* Access member dashboard
* View event information
* Manage profile
* Participate in club activities

### Administrator

Can:

* Manage events
* Manage members
* Approve registrations
* View participant lists
* Update organization information

## How It Works

1. Public user accesses the website.
2. User submits a registration request.
3. Administrator reviews the request.
4. Approved users receive access instructions.
5. Member creates password and logs in.
6. Member accesses club resources and events.
7. Administrators manage events and participants through the admin dashboard.

## Security Features

* Password hashing using Bcrypt
* Role-based access control
* Protected admin routes
* Secure authentication workflow
* Firebase Admin integration

## What I Have Learned

* Full-stack application development
* React component architecture
* REST API development
* MongoDB database design
* User role management
* Authentication and authorization
* Email notification systems
* Firebase integration
* Event management workflows
* Responsive UI design


## Author

**May Thet Naing Bo**

Software Developer focused on Full-Stack Development, DevOps, Cloud Technologies, and AI-powered Applications.
