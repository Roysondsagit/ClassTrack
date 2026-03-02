🟡⚫ ClassTrack

A Role-Based Attendance Tracking System

🛠 Tech Stack

Backend & Database: Supabase (PostgreSQL + RLS)

Authentication: Supabase Auth

Frontend: React (via Vite)

Styling: HTML + CSS + JavaScript

Deployment: Vercel

Version Control: Git + GitHub

🎯 Project Goal

Build a secure attendance tracking system with:

Role-based authentication (Admin & User)

Admin-only dashboard

User attendance dashboard

Yellow/Black animated UI

Dark/Light mode toggle

Production deployment

🗺 10-WEEK DEVELOPMENT ROADMAP
🧱 PHASE 1 — BACKEND (Weeks 1–4)
✅ WEEK 1 — Supabase Setup & Database Architecture
🎯 Objectives:

Create backend foundation

Design schema

Plan relationships

🛠 Tasks:

Create Supabase Project

Enable Row Level Security (RLS)

Design database schema

📊 Database Tables
1️⃣ profiles

(Extends Supabase auth.users)

id (uuid, references auth.users)

full_name (text)

role (admin | user)

created_at (timestamp)

2️⃣ classes

id (uuid)

name (text)

created_by (admin id)

created_at

3️⃣ attendance

id (uuid)

user_id (uuid)

class_id (uuid)

date (date)

status (present | absent)

marked_by (admin id)

📦 Deliverables:

✔ ER Diagram
✔ Table schema finalized
✔ RLS enabled

✅ WEEK 2 — Role-Based Security (RLS Policies)
🎯 Objectives:

Secure database completely

Implement admin-only logic

🔐 Policies to Implement:
USERS CAN:

View their own attendance

View class list

Update own profile

ADMIN CAN:

View all users

Create classes

Insert attendance

Update attendance

Delete attendance

View all reports

⚠ Important:

No direct client-side role trust

All permissions controlled via RLS

📦 Deliverables:

✔ Fully secure backend
✔ Admin vs User separation working

✅ WEEK 3 — Backend Testing & Validation
🎯 Objectives:

Test all operations before frontend

🧪 Testing Checklist:

Insert attendance as admin

Fetch own attendance as user

Block user from accessing other users' data

Block non-admin from creating classes

Validate role enforcement

📦 Deliverables:

✔ All database operations tested
✔ Security validated

✅ WEEK 4 — Admin Feature Architecture
🎯 Objectives:

Define exact admin system logic

📋 Admin Panel Features Finalized:

Create Class

View All Users

Mark Attendance

Edit Attendance

View Attendance by Date

Attendance Analytics

Delete Records (optional)

📦 Deliverables:

✔ Backend fully ready
✔ Admin feature scope frozen

🔐 PHASE 2 — AUTHENTICATION (Weeks 5–6)
✅ WEEK 5 — Supabase Authentication Integration
🎯 Objectives:

Implement sign up / sign in

Assign roles automatically

🛠 Tasks:

Enable Email/Password Auth

Create Sign Up page

Create Sign In page

On signup:

Insert into profiles table

Default role = user

Create one manual admin user

📦 Deliverables:

✔ Working registration
✔ Working login
✔ Session persistence

✅ WEEK 6 — Protected Routes & Role Control
🎯 Objectives:

Prevent unauthorized admin access

🛠 Tasks:

Create ProtectedRoute component

Check session

Fetch user role

Conditional routing:

Role	Access
user	Dashboard only
admin	Dashboard + Admin Panel
🚫 If non-admin tries /admin:

→ Redirect to dashboard

📦 Deliverables:

✔ Secure admin-only panel
✔ Auth state management complete

🎨 PHASE 3 — FRONTEND DEVELOPMENT (Weeks 7–9)
✅ WEEK 7 — UI System & Theme Design
🎯 Objectives:

Create animated Yellow/Black system

🎨 Theme System
Primary Theme:

Background: Black

Primary: Yellow (#FFD700)

Accent: Neon Yellow glow

Text: White

🌗 Dark/Light Mode Toggle

Implement using:

CSS variables

LocalStorage

Smooth transitions (0.3s–0.5s)

✨ UI Effects:

Hover glow buttons

Animated gradient backgrounds

Smooth page transitions

Sidebar slide animation

📦 Deliverables:

✔ Complete design system
✔ Dark/Light toggle functional

✅ WEEK 8 — User Dashboard
🎯 Objectives:

Build student experience

📋 Pages:

Dashboard

Attendance percentage

Recent attendance

Class View

Profile

Logout

📊 Optional Enhancements:

Progress bar

Attendance chart

Filter by date

📦 Deliverables:

✔ Fully functional user dashboard

✅ WEEK 9 — Admin Panel UI
🎯 Objectives:

Complete admin experience

📋 Admin Pages:

Overview Dashboard

Create Class

Mark Attendance

View All Users

Attendance Reports

Filter by date/class

🛠 UI Features:

Search bar

Pagination

Modal forms

Confirmation dialogs

📦 Deliverables:

✔ Fully working Admin Panel
✔ Clean UI consistency

🚀 PHASE 4 — DEPLOYMENT (Week 10)
✅ WEEK 10 — Production & Deployment
🎯 Objectives:

Deploy ClassTrack to production

🛠 Steps:
1️⃣ Prepare Production Build

npm run build

Fix warnings

Remove console.logs

2️⃣ Environment Variables

Add to Vercel:

SUPABASE_URL

SUPABASE_ANON_KEY

3️⃣ Deploy

Push to GitHub

Import project to Vercel

Add environment variables

Deploy

4️⃣ Post-Deployment Testing

Test signup

Test admin login

Test RLS

Test admin restrictions

📦 Deliverables:

✔ Live production app
✔ Secure deployment
✔ Admin-only panel protected

🔒 Security Checklist

✅ RLS enabled

✅ Admin role stored in database

✅ No hardcoded secrets

✅ Env variables used

✅ Role-based route protection

✅ Backend security validated before frontend

🏗 Final Architecture Overview
Supabase (DB + Auth)
        ↓
React (Vite Frontend)
        ↓
Role-Based Routing
        ↓
Vercel Deployment
🏁 Final Outcome After 10 Weeks

You will have:

🔐 Secure role-based authentication

🟡⚫ Modern animated UI

🌗 Dark/Light mode

📊 Admin attendance management

👨‍🎓 Student dashboard

🚀 Live production deployment

💼 Strong portfolio project