# 🚀 Production-Ready Full-Stack Developer Portfolio

A modern, high-performance, and fully responsive **Personal Portfolio & Live-Editable Content Management Application** built with **React 18, TypeScript, Tailwind CSS, Vite, Node.js, Express, MongoDB, Mongoose, and Swagger OpenAPI 3**.

---

## ✨ NEW: In-Page Dynamic Live Editing (CMS Mode)

You can change **each and every piece of data directly on the web page itself**, and it saves immediately to the **MongoDB database**!

### How Live Editing Works:
1. Open the portfolio at [http://localhost:5173](http://localhost:5173).
2. Look at the bottom-left corner of the screen: click the **"Enable In-Page Editing"** button.
3. If not already authenticated, a 1-click modal appears with the default administrator credentials (`admin@portfolio.dev` / `AdminPass123!`). Click **"Unlock & Enable Editing"**.
4. **Live Edit Mode** turns **ON**:
   - **Hero Section**: Click the edit button on your name, title, or avatar to change bio, titles, links, and photos with instant save to MongoDB.
   - **Projects**: Direct **"Add Project"** button on the page. Every project card has an **Edit** and **Delete** button right on the card.
   - **Skills**: Direct **"Add Skill"** button on the page. Every skill badge has inline edit & delete controls.
   - **Experience & Education**: Timeline entries have inline edit and delete buttons to update companies, degrees, dates, and descriptions.
   - **Services**: Direct **"Add Service"** button and inline card editors.
   - **Blog**: Direct **"Write Article"** button and inline article editors.
5. Every edit or new item created makes an immediate REST API request to MongoDB, updates your database, and shows a confirmation toast notification.

---

## 📑 Table of Contents

1. [Features & Capabilities](#-features--capabilities)
2. [Tech Stack](#-tech-stack)
3. [Architecture & Folder Structure](#-architecture--folder-structure)
4. [Database Models](#-database-models)
5. [REST API & Swagger Documentation](#-rest-api--swagger-documentation)
6. [Security & Best Practices](#-security--best-practices)
7. [Installation & Getting Started](#-installation--getting-started)
8. [Environment Variables](#-environment-variables)
9. [Development & Production Commands](#-development--production-commands)
10. [Default Admin Credentials](#-default-admin-credentials)

---

## ✨ Features & Capabilities

### 1. In-Page Dynamic Live Editing
* **Floating Live Edit Toolbar**: Switch between View mode and Live Edit mode on any public page.
* **Inline Modals & Controls**: Quick-edit dialogs for Profile, Projects, Skills, Experiences, Education, Services, and Articles.
* **Direct Database Persistence**: All edits, uploads, and deletions persist to MongoDB in real time.

### 2. Public Portfolio Pages
* **Sticky Responsive Navbar**: Smooth backdrop blur, interactive navigation links, dark/light theme switch, resume shortcut, and mobile menu.
* **Hero Section**: Profile avatar with ambient glow effects, job title, availability status badge, elevator pitch, action CTA buttons, and social media links.
* **About Me**: In-depth professional narrative, key metric counters (years experience, completed projects, certifications, client satisfaction), and core engineering values.
* **Technical Skills Matrix**: Categorized proficiencies (Frontend, Backend, Database, DevOps & Cloud, Tools) with interactive category filters, real-time search, and animated percentage progress bars.
* **Portfolio Projects Showcase**: Filterable project gallery with featured badges, tech tags, and direct links to live deployments and GitHub repositories.
* **Experience Timeline**: Career history timeline showing companies, job roles, date ranges, office locations, responsibilities, and technical stacks.
* **Education & Credentials**: Academic degrees and professional industry certifications (AWS, Kubernetes).
* **Engineering Services**: Service packages with Lucide icon integration, detailed descriptions, and engagement process walkthrough.
* **Interactive Printable Resume**: Clean CV layout with print / export-to-PDF button and downloadable file link.
* **Blog & Publications**: Technical articles with category tags, cover images, reading time, full slug-based reading page (`/blog/:slug`), and author card.
* **Contact Outreach**: Direct message submission with client & server-side validation, direct contact cards (email, phone, location, hours), and non-blocking toast notifications.
* **Dark / Light Mode**: System theme detection with instant toggle and `localStorage` persistence.

### 3. Dedicated Admin Dashboard
* **Administrative Console** available at `/admin/dashboard`.
* **Metrics & Analytics**: Project counts, skill counts, inbox message counts, article counts.
* **Management Views**: Dedicated CRUD tables for Profile, Skills, Projects, Experience, Education, Services, Blogs, and Contact Inquiries Inbox.

---

## 🛠 Tech Stack

### Frontend
* **React.js 18**: UI component library with modular functional components and hooks.
* **TypeScript**: Strict type safety across components, props, contexts, and API responses.
* **Vite**: Ultra-fast module bundler with Hot Module Replacement (HMR) and backend API proxying.
* **Tailwind CSS**: Utility-first CSS framework with tailored color palette, dark mode, custom glassmorphism utilities, and micro-interactions.
* **React Router v6**: Client-side routing with nested layouts, parameter matching, and route guards.
* **Axios**: HTTP client configured with request/response interceptors and automatic JWT Bearer token injection.
* **Lucide React**: Clean, modern icons for technical and UI indicators.

### Backend
* **Node.js & Express.js**: RESTful API service architected with clean separation of concerns.
* **TypeScript**: Strict type checking with CommonJS output and ts-node-dev development server.
* **MongoDB & Mongoose**: Object modeling with schemas, indexes, hooks, and validations. Includes a zero-config in-memory fallback for immediate local testing if MongoDB service is not started.
* **JWT (JSON Web Tokens)**: Stateless token-based authentication with expiration controls.
* **bcryptjs**: Salted password hashing for administrator account security.
* **Multer**: Static media and document upload management.
* **Helmet**: HTTP security headers protection.
* **CORS**: Configurable cross-origin resource sharing.
* **Morgan**: HTTP request logging.
* **dotenv**: Environment variable management.

### API Documentation
* **Swagger UI / OpenAPI 3**: Interactive specification available at `/api-docs` with JWT Bearer authentication.

---

## 🗄 Database Models

1. **User**: `name`, `email` (unique), `password` (bcrypt hash, excluded in queries), `role` (`admin` | `user`), `timestamps`.
2. **Profile**: `name`, `title`, `bio`, `profileImage`, `resumeUrl`, `location`, `email`, `phone`, `socialLinks` (github, linkedin, twitter, website, instagram, youtube).
3. **Skill**: `name`, `category` (`Frontend`, `Backend`, `Database`, `DevOps & Cloud`, `Mobile & Other`, `Tools`), `proficiency` (1-100), `icon`, `order`.
4. **Project**: `title`, `description`, `image`, `technologies` (array), `githubUrl`, `liveUrl`, `featured` (boolean), `order`, `timestamps`.
5. **Experience**: `company`, `position`, `description`, `startDate`, `endDate`, `location`, `technologies`, `order`.
6. **Education**: `institution`, `degree`, `field`, `startDate`, `endDate`, `description`.
7. **Service**: `title`, `description`, `icon`.
8. **Blog**: `title`, `slug` (unique), `content`, `excerpt`, `image`, `tags`, `published` (boolean), `timestamps`.
9. **ContactMessage**: `name`, `email`, `subject`, `message`, `status` (`unread` | `read` | `replied` | `archived`), `timestamps`.

---

## 📡 REST API & Swagger Documentation

All API responses follow a uniform structure:

```json
{
  "success": true,
  "message": "Projects fetched successfully",
  "data": []
}
```

### Swagger UI Endpoint
Navigate to:
```text
http://localhost:5000/api-docs
```
You can click **Authorize** in the Swagger UI and enter your Bearer token:
```text
Bearer <your_jwt_token_here>
```

---

## 🚀 Installation & Getting Started

### Prerequisites
* **Node.js** (v18.x, v20.x, or v22.x+ LTS)
* **npm** or **pnpm**
* **MongoDB** (Local instance or MongoDB Atlas connection URI). *Note: The server includes an automatic in-memory fallback if a local database service is not yet started.*

### 1. Clone & Install Dependencies

From the repository root:

```bash
# Install root, backend, and frontend packages
npm run install:all
```

### 2. Configure Environment Variables

Create `.env` in the `server/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=super_secret_jwt_portfolio_key_99482
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 🖥 Development & Production Commands

### Run in Development

**Option A — From project root:**
```bash
# Terminal 1: Start Backend Server (runs on port 5000)
npm run dev:server

# Terminal 2: Start Frontend Client (runs on port 5173)
npm run dev:client
```

**Option B — Inside individual directories:**
```bash
# Backend (server/)
npm run dev

# Frontend (client/)
npm run dev
```

### Access Applications
* 🌐 **Public Portfolio (with Live In-Page Editor)**: [http://localhost:5173](http://localhost:5173)
* 🔐 **Admin Dashboard Portal**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
* 📚 **Interactive Swagger API Docs**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
* ⚡ **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Default Admin Credentials

Upon initial launch, the database seeder automatically creates the default administrator account:

* **Email**: `admin@portfolio.dev`
* **Password**: `AdminPass123!`
