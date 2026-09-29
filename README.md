# CampusConnect

> **A unified digital platform for managing and discovering college events, clubs, and student activities.**

CampusConnect is a full-stack college event and campus engagement platform designed to bring **students, event organizers, clubs, and college administrators** onto a single platform.

It allows students to discover and register for campus events, organizers to create and manage events, and administrators to oversee campus activities from a centralized dashboard.

---

## 🚀 Features

### 👨‍🎓 Student

- Student registration and login
- Student profile
- Browse upcoming campus events
- Search and filter events
- View detailed event information
- Register for events
- View registered events
- Receive event updates and notifications
- Discover clubs and campus activities
- Find opportunities to participate in events and activities

### 🎯 Organizer

- Organizer registration and login
- Create and publish events
- Edit and manage events
- View registered participants
- Manage event capacity
- Track event registrations
- View event status

### 🛡️ Administrator

- Admin dashboard
- Manage students and organizers
- Review submitted events
- Approve or reject events
- Monitor campus activities
- View basic event and registration statistics
- Manage platform content

---

## 🏗️ System Architecture

CampusConnect follows a **three-layer full-stack architecture**:

```text
┌──────────────────────────────┐
│         React Frontend       │
│      UI / User Interface     │
└──────────────┬───────────────┘
               │
               │ REST API
               ▼
┌──────────────────────────────┐
│       Java Spring Boot       │
│       Backend / API Layer    │
├──────────────────────────────┤
│ Controllers                  │
│ Services                     │
│ Repositories                 │
│ Authentication & Validation  │
└──────────────┬───────────────┘
               │
               │ JPA / Hibernate
               ▼
┌──────────────────────────────┐
│            MySQL             │
│          Database            │
└──────────────────────────────┘
```

### Request Flow

```text
User
  ↓
React Interface
  ↓
REST API Request
  ↓
Spring Boot Controller
  ↓
Service Layer
  ↓
Repository Layer
  ↓
MySQL Database
  ↓
Response
  ↓
React Interface
```

---

## 🛠️ Technology Stack

| Layer             | Technology                  |
| ----------------- | --------------------------- |
| Frontend          | React.js                    |
| Styling           | HTML, CSS                   |
| Frontend Language | JavaScript                  |
| Backend           | Java                        |
| Backend Framework | Spring Boot                 |
| API               | REST                        |
| ORM               | Spring Data JPA / Hibernate |
| Database          | MySQL                       |
| Authentication    | Spring Security             |
| API Testing       | Postman                     |
| UI/UX Design      | Figma                       |
| Version Control   | Git & GitHub                |
| Build Tool        | Maven                       |

---

## 📂 Project Structure

The project is divided into frontend and backend applications.

```text
CampusConnect/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── campusconnect/
│   │   │   │           ├── controller/
│   │   │   │           ├── service/
│   │   │   │           ├── repository/
│   │   │   │           ├── model/
│   │   │   │           ├── dto/
│   │   │   │           ├── config/
│   │   │   │           └── CampusConnectApplication.java
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   └── test/
│   │
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── database/
│   └── README.md
│
├── documentation/
│   ├── requirements/
│   ├── design/
│   └── testing/
│
└── README.md
```

> The project structure may evolve as development progresses.

---

## 👥 User Roles

CampusConnect uses role-based access.

### Student

Students can:

```text
Register / Login
       ↓
Student Dashboard
       ↓
Browse Events
       ↓
View Event Details
       ↓
Register
       ↓
View My Events
```

### Organizer

Organizers can:

```text
Login
  ↓
Organizer Dashboard
  ↓
Create Event
  ↓
Submit Event
  ↓
Admin Approval
  ↓
Event Published
  ↓
Manage Registrations
```

### Administrator

Administrators can:

```text
Login
  ↓
Admin Dashboard
  ↓
Review Events
  ├── Approve
  └── Reject
  ↓
Manage Users
  ↓
Monitor Campus Activities
```

---

## 🗄️ Database

The application uses **MySQL** as its relational database.

The database is designed around the major entities of the platform.

Possible core entities include:

```text
User
 │
 ├── Student
 ├── Organizer
 └── Admin

Event
 │
 ├── Event Details
 ├── Organizer
 └── Registrations

Registration
 │
 ├── Student
 └── Event

Club
 │
 └── Events
```

The final database schema will be documented as development progresses.

---

## 🔐 Authentication & Authorization

CampusConnect uses **Spring Security** for authentication and authorization.

Different users receive access based on their assigned role:

```text
ROLE_STUDENT
ROLE_ORGANIZER
ROLE_ADMIN
```

For example:

- Students cannot access administrator functions.
- Organizers can manage their own events.
- Administrators can review and manage platform-wide content.

Passwords will be securely stored using password hashing rather than plain text.

---

## 🔌 API

The frontend communicates with the Spring Boot backend through REST APIs.

Example endpoint structure:

```text
/api/auth
/api/users
/api/events
/api/registrations
/api/clubs
/api/notifications
/api/admin
```

Example event operations:

```text
GET     /api/events
GET     /api/events/{id}
POST    /api/events
PUT     /api/events/{id}
DELETE  /api/events/{id}
```

The API structure may change during development as the application architecture is finalized.

---

## ⚙️ Getting Started

### Prerequisites

Install the following before running the project:

- Java JDK
- Maven
- Node.js and npm
- MySQL
- Git
- IntelliJ IDEA / VS Code / another suitable IDE
- Postman (recommended)

Verify installations:

```bash
java -version
mvn -version
node -v
npm -v
git --version
```

---

## 📥 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd CampusConnect
```

### 2. Configure MySQL

Create a MySQL database:

```sql
CREATE DATABASE campusconnect;
```

Configure the database connection in:

```text
backend/src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/campusconnect
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

> Do not commit real database passwords or other secrets to GitHub.

### 3. Start the backend

Navigate to the backend:

```bash
cd backend
```

Run:

```bash
mvn spring-boot:run
```

The Spring Boot server will start on the configured port.

### 4. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The React development server will start on the displayed local URL.

---

## 🔧 Development Workflow

CampusConnect is developed using Git and GitHub.

Recommended workflow:

```text
main
 │
 ├── feature/authentication
 ├── feature/events
 ├── feature/registration
 ├── feature/student-dashboard
 └── feature/admin-dashboard
```

### Basic workflow

```bash
git pull
git checkout -b feature/your-feature
```

Make your changes, then:

```bash
git add .
git commit -m "Add event registration"
git push origin feature/your-feature
```

Changes should be reviewed before being merged into `main`.

---

## 🧪 Testing

Testing will cover:

- Authentication
- Authorization
- Event creation
- Event approval
- Event registration
- Duplicate registration prevention
- Input validation
- API responses
- Database operations
- Frontend functionality
- User interface behavior

API endpoints can be tested using **Postman**.

Automated tests will be added as development progresses.

---

## 🎯 Project Goals

CampusConnect aims to:

- Centralize college events and activities.
- Make campus events easier for students to discover.
- Simplify event creation and management.
- Improve communication between students, clubs, organizers, and administrators.
- Make event registration more organized.
- Provide administrators with better visibility into campus activities.
- Encourage student participation and collaboration.

---

## 🔮 Future Scope

Potential future improvements include:

- Mobile application
- QR-based event attendance
- Personalized event recommendations
- Push notifications
- Club management
- Team-member matching based on skills and interests
- Calendar integration
- Event analytics
- College ERP integration
- Multiple college/campus support

---

## 📄 Project Status

**Status:** 🚧 In Development

CampusConnect is currently being developed as a full-stack academic project using **React.js, Java Spring Boot, and MySQL**.

Features and architecture may evolve throughout development.

---

## 📜 License

This project is currently intended for **academic and educational purposes**.

A formal license may be added if the project is released publicly.
