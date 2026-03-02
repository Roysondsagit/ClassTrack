# 🟡⚫ ClassTrack

> **A secure, role-based attendance tracking system for modern classrooms.**

ClassTrack solves the problem of manual, error-prone attendance management by providing a digital platform where admins can create classes, mark attendance, and generate reports — while students get a real-time view of their own attendance records. Built with a sleek Yellow/Black animated UI and full role-based access control.

🚀 **Live Demo:** [class-track-ebon.vercel.app](https://class-track-ebon.vercel.app)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Credits](#-credits)

---

## ✨ Features

### 🎓 Student (User)
- View personal attendance percentage with a live progress bar
- See recent attendance records per class
- Browse all available classes
- Edit profile name and view role

### ⚡ Admin
- System-wide dashboard (total users, classes, records, today's present count)
- Create classes with confirmation modal
- Mark attendance per student per class per date (with bulk "All Present" shortcut)
- Searchable user management table
- Filter attendance reports by class and date with summary stats

### 🔒 Security
- Row Level Security (RLS) on all Supabase tables
- Role stored securely in the database — no client-side trust
- Protected routes — non-admins cannot access `/admin/*`
- Auth session persistence via Supabase

### 🎨 UI/UX
- Yellow (`#FFD700`) / Black animated theme
- Dark / Light mode toggle (persists in localStorage)
- Smooth page transitions and sidebar slide animation
- Hover glow effects on buttons and cards

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite |
| **Styling** | Vanilla CSS (custom design system) |
| **Backend & DB** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth (Email/Password) |
| **Routing** | React Router v6 |
| **Deployment** | Vercel |
| **Version Control** | Git + GitHub |

---

## 💻 Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- A [Supabase](https://supabase.com) account and project
- [Git](https://git-scm.com/)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ClassTrack.git
   cd ClassTrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Set up the Supabase database**

   Run the following SQL in your [Supabase SQL Editor](https://supabase.com/dashboard):

   ```sql
   -- Create tables
   CREATE TABLE public.profiles (
     id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
     full_name TEXT,
     role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
   );

   CREATE TABLE public.classes (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     created_by UUID REFERENCES public.profiles(id),
     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
   );

   CREATE TABLE public.attendance (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
     class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
     date DATE NOT NULL,
     status TEXT NOT NULL CHECK (status IN ('present', 'absent')),
     marked_by UUID REFERENCES public.profiles(id),
     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     UNIQUE (user_id, class_id, date)
   );

   -- Enable RLS (see full migration in /docs if available)
   ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
   ```

5. **Start the dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173)

---

## 🚀 Usage

### Creating an Admin User
1. Sign up normally on the app
2. Go to **Supabase → Table Editor → `profiles`**
3. Find your user row and set `role` to `admin`
   - Or run: `UPDATE public.profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');`
4. Refresh the app — the Admin panel appears in the sidebar

### Marking Attendance (Admin)
1. Go to **Admin → Mark Attendance**
2. Select a class and date
3. Toggle each student as Present ✅ or Absent ❌
4. Click **Save Attendance**

### Viewing Reports (Admin)
1. Go to **Admin → Reports**
2. Filter by class and/or date
3. Click **Generate Report** to see records + summary stats

---

## 📸 Screenshots

> 🌐 Live app: [classtrack2285.vercel.app](https://classtrack2285.vercel.app)

| Login Page | Signup Page |
|-----------|------------|
| Dark Yellow/Black theme with glow background | Matching design with full registration form |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** this repository
2. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes with a clear message:
   ```bash
   git commit -m "feat: add your feature description"
   ```
4. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** against the `main` branch

### Reporting Issues
Please use [GitHub Issues](https://github.com/YOUR_USERNAME/ClassTrack/issues) to report bugs or request features. Include:
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 ClassTrack

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🙏 Credits & Acknowledgments

- **[Supabase](https://supabase.com)** — Backend, database, and authentication
- **[Vite](https://vitejs.dev)** — Lightning-fast React build tool
- **[React Router](https://reactrouter.com)** — Client-side routing
- **[Vercel](https://vercel.com)** — Deployment and hosting
- **[Inter Font](https://fonts.google.com/specimen/Inter)** — Typography by Google Fonts
- **PLANNER.md** — Project architecture and roadmap authored by the developer

---

<div align="center">
  <b>Built with 🟡 and ⚫ | <a href="https://classtrack2285.vercel.app">classtrack2285.vercel.app</a></b>
</div>
