# 🚚 MealRoute Admin – Secure Logistics & Delivery Management

<p align="center">
  <img src="https://img.shields.io/badge/Status-Live-4ade80?style=flat-square" alt="Status">
  <img src="https://img.shields.io/badge/Security-RBAC_Enforced-ff9933?style=flat-square" alt="Security">
  <img src="https://img.shields.io/badge/Stack-React_|_Firebase-61DAFB?style=flat-square" alt="Stack">
</p>

MealRoute is a production-grade **Delivery Management System** designed for high-volume logistics operations. It focuses on absolute data reliability, real-time synchronization, and a **security-first** architecture to manage clients, delivery staff, and financial reporting for subscription-based meal services.

---

### 🌐 Live Platform
- **Production Dashboard**: [mealrouteadmin.web.app](https://mealrouteadmin.web.app)
- **One-Click Demo**: Access the dashboard instantly via the **One-Click Demo Login** on the login page.

---

### 🏗️ Built With (Secure Engineering Stack)
- **Frontend**: [React 18](https://reactjs.org/) (Hooks & Functional Components)
- **Build Tool**: [Vite](https://vitejs.dev/) for ultra-fast HMR and optimized production bundles.
- **Backend-as-a-Service**: [Firebase](https://firebase.google.com/) (Firestore for real-time DB, Hosting for global delivery).
- **Icons**: Lucide React for consistent, high-end visual language.
- **Styling**: Modern CSS Grid/Flexbox with a custom Glassmorphic design system.

---

### 🔐 Security & Reliability Features
- **Role-Based Access Control (RBAC)**: Custom authentication context ensures only authorized personnel access sensitive client and financial data.
- **Firewall & Firestore Rules**: Fine-grained security rules at the database level to prevent unauthorized CRUD operations.
- **Real-time Persistence**: Leverages `onSnapshot` for zero-lag updates across the admin and staff layers.
- **Offline Fallback**: Resilient admin authentication profiles to prevent lockouts during service-wide downtime.

---

### 📦 Project Structure
```bash
src/
├── components/     # Reusable UI (Modals, Custom Layouts)
├── context/        # Secure Auth & Global State Management
├── pages/          # Domain-specific views (Clients, Staff, Finance)
├── services/       # Database & Auth logic (Clean Architecture)
└── utils/          # Real-time synchronization & formatting helpers
```

---

### 🚀 Getting Started locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ganeshkrishnareddy/mealroute.git
   cd mealroute
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Firebase**:
   Create a `.env` file or update `src/lib/firebase.js` with your Firebase project credentials.

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

### 👨‍💻 Developed By
**P Ganesh Krishna Reddy**
*Secure Software Engineer (Cybersecurity & Full-Stack)*
- **LinkedIn**: [linkedin.com/in/pganeshkrishnareddy](https://linkedin.com/in/pganeshkrishnareddy)
- **Portfolio**: [pganeshreddy.netlify.app](https://pganeshreddy.netlify.app/)
- **Email**: pganeshkrishnareddy@gmail.com
- **Phone**: +91 8374622779

---

### 📜 Professional Context
This project was built to solve specific logistics challenges: automating daily delivery tasks, managing subscription-based payments, and securing operational data from unauthorized access. It stands as a testament to the intersection of **Scalable Development** and **System Defense**.

