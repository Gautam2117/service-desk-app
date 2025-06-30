<h1 align="center">
  <img src="https://github.com/Gautam2117/service-desk-app/blob/master/public/service_desk_logo.png?raw=true" width="40" height="40" style="border-radius: 50%; vertical-align: middle; margin-right: 10px;" />
  🛠️ Service Desk App
</h1>

A modern, responsive Service Desk Application built with **React (Vite)**, **Firebase**, and **Razorpay**. Users can raise support tickets, track their progress, and receive real-time updates. Admins can manage, assign, and resolve tickets efficiently with a clean UI and activity logging system.

> 🚀 This project was developed as part of the **Celebal Technologies Summer Internship Program**.

---

## ✨ Features

🛡 **Secure Authentication with Firebase**  
- Email/password login using Firebase Authentication  
- Role-based routing: users vs admins  
- Session persistence and protected routes

🎫 **Smart Ticketing System**  
- Raise support tickets with **category**, **priority**, and **issue description**  
- View all your tickets with real-time status updates  
- Fully functional **ticket detail view** with comments and updates

🧑‍💼 **Role-Based Dashboards**  
- 👤 Users: Submit & track tickets, comment on issues  
- 🛠️ Admins: Assign, resolve, or escalate tickets, manage priorities

📂 **File Upload Support**  
- Users can upload **screenshots or supporting documents** with tickets  
- Stored securely in **Firebase Storage**  
- Downloadable attachments for admin review

📜 **Ticket Timeline with Audit Logs**  
- Every action (created, assigned, resolved, commented) is auto-logged  
- Real-time **timeline tracking** inside ticket detail view

📊 **Admin Panel with Analytics**  
- Live dashboard of total tickets, status breakdown, priorities  
- Powerful **search**, **filter by category/priority/status/date**  
- Export data to **CSV** or **PDF** with one click

💳 **Razorpay Payment Integration**  
- Option for users to **pay for priority support**  
- Premium tickets get highlighted in admin dashboard  
- Integrated Razorpay Checkout flow

📢 **Real-time Comments System**  
- Users and admins can **comment and reply** on ticket threads  
- Includes **@mention support**, timestamps, and live sync

🧠 **Responsive & Sleek UI**  
- Built with Tailwind CSS & React  
- Responsive on all screen sizes  
- Smooth animations and clean layouts

---

## 🚀 Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS
- **Backend & Auth**: Firebase (Auth + Firestore + Storage)
- **Payments**: Razorpay (Web Checkout Integration)
- **Deployment**: Vercel

---

## 🖥️ Screenshots

<details>
  <summary>🔐 Login Screen</summary>
  <img src="https://raw.githubusercontent.com/Gautam2117/service-desk-app/refs/heads/master/Login.png" width="500"/>
</details>

<details>
  <summary>📝 Register Screen</summary>
  <img src="https://raw.githubusercontent.com/Gautam2117/service-desk-app/refs/heads/master/Register.png" width="500"/>
</details>

<details>
  <summary>👤 User Panel</summary>
  <img src="https://github.com/Gautam2117/service-desk-app/blob/master/User_Panel.png" width="500"/>
</details>

<details>
  <summary>🎫 Ticket Detail View</summary>
  <img src="https://github.com/Gautam2117/service-desk-app/blob/master/Ticket_Detail.png" width="500"/>
</details>

<details>
  <summary>➕ Raise Ticket Form</summary>
  <img src="https://github.com/Gautam2117/service-desk-app/blob/master/Raise_Ticket.png" width="500"/>
</details>

<details>
  <summary>🛠️ Admin Panel</summary>
  <img src="https://github.com/Gautam2117/service-desk-app/blob/master/Admin_Panel.png" width="500"/>
</details>

---

## 🔧 Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/Gautam2117/service-desk-app.git
   cd service-desk-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the app**
   ```bash
   npm run dev
   ```

---

## 🧪 Test Credentials (for demo)

| Role  | Email                             | Password      |
|-------|-----------------------------------|---------------|
| Admin | govindgautam933@gmail.com         | gautam123     |
| User  | gautamgovind296@gmail.com         | gautam123     |

---

## 📦 Deployment

The app is Vercel-ready. Just import the GitHub repo, set the environment variables, and deploy.  
✅ Framework Preset: `Vite`  
✅ Output Directory: `dist`  
✅ Build Command: `npm run build`

---

---

## 👨‍💻 Developed By

**Gautam Govind**  
B.Tech, Manipal University Jaipur  
[LinkedIn](https://www.linkedin.com/in/gautamg01) • [GitHub](https://github.com/Gautam2117)
