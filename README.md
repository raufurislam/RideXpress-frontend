## 🚖 Ride Management System – Frontend Requirements (React + Redux Toolkit + RTK Query)

### **Project Overview**

Develop a **production-grade**, fully responsive, and role-based full stack application for a **Ride Booking Platform** (similar to **Uber** or **Pathao**) using React.js, Redux Toolkit, and RTK Query.

The frontend will interact with the **Ride Booking Backend API** to support distinct user experiences for **Riders**, **Drivers**, and **Admins**, ensuring a consistent, polished, and intuitive UI/UX across all devices.

You will create:

- A **public landing experience** introducing the ride booking system
- A **role-based dashboard interface** with tailored features for each user type
- Robust **state management and API integration** via Redux Toolkit & RTK Query
- Responsive UI and polished UX

---

### **Tech Stack**

- **Frontend Framework**: React (with React Router for routing)
- **State Management**: Redux Toolkit, RTK Query, Axios (optional)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (with responsive utility classes) or other css frameworks
- **Backend API**: Node.js/Express, MongoDB, JWT + bcrypt (Secure Authentication)
- **Optional Enhancements**: recharts (data visualization), react-hot-toast (notifications)

---

### **📌 Core Functional Requirements**

### **1️⃣ Responsive Design & Visual Consistency**

- Fully responsive layout for mobile, tablet, and desktop devices.
- Consistent typography, spacing, and color palette across all pages.
- Sticky navigation bar with at least 6 clearly menu option routes and dropdown menu if required.
- Footer designed to complement the theme and include functional links.
- Improving performance through lazy-loading or skeleton loaders and ensure accessibility standards are met.
- Populating the project with real or realistic data while avoiding placeholder text to give a professional finish.

### **2️⃣ Public Landing Pages/Homepage**

Accessible without authentication:

- **Home** – Must include **at least 5 distinct, well-structured sections** (excluding navbar and footer).
  - **Examples:** Hero Banner, How-it-works Overview, Service Highlights, Customer Feedback/Testimonials, Call-to-action Prompts, or Promotions/Special Offers.
- **About Us** – Company background, mission, and team profiles.
- **Features** – Detailed breakdown of Rider, Driver and Admin capabilities.
- **Contact** – Validated form for inquiries (simulated submission).
- **FAQ** – Searchable list of common questions.

### **3️⃣ Authentication & Authorization**

- JWT-based login and registration with role selection (`Rider`,`Driver`or`Admin`).
- Registration form with role selection (`Rider`and`Driver`).
- Google/Facebook login integration is optional. (However, if it is implemented, it must appropriately manage user roles)
- Role-based landing pages upon login.
- Account Status Handling:
  - Blocked or Suspended Users:
    - Redirected to a dedicated status page instead of accessing dashboards. This page must display the account status and provide instructions or contact details to resolve the issue.
  - Offline Drivers **(Offline indicates that the driver does not wish to receive any ride requests from riders):**
    - Can still access all dashboard pages except features directly related to ride acceptance (e.g., incoming ride requests and accept buttons). Instead of showing those features, display a notice prompting them to go online to receive rides.
- Persistent authentication state across sessions.
- Logout functionality

### **4️⃣ Rider Features**

- **Ride Request Form**: Pickup and destination fields, fare estimation, payment method selection.
- **Live Ride Tracking**: Ongoing ride updates with real time map with driver details. (Optional)
- **Ride History**: Paginated list with search and filters (date, fare range, status).
- **Ride Details Page**: Map route (optional), timestamps, driver info, and ride status timeline.
- **Profile Management**: Edit Name, Phone Number, and Change Password.

### **5️⃣ Driver Features**

- **Availability Control**: Online/Offline Toggle.
- **Incoming Requests**: Accept or Reject rider offers.
- **Active Ride Management**: Update statuses (Accepted → Picked Up → In Transit → Completed) or (Cancelled).
- **Earnings Dashboard**: Visual breakdown (daily, weekly, monthly) with charts.
- **Ride History**: Paginated and filterable past ride records.
- **Profile Management**: Vehicle details, contact info, and password updates.

### **6️⃣ Admin Features**

- **User Management**: Search, filter, block/unblock riders, approve/suspend drivers.
- **Ride Oversight**: View all rides with advanced filtering by date, status, driver, or rider.
- **Analytics Dashboard**: Data visualizations for ride volume, revenue trends, and driver activity.
- **Search & Filter Tools**: Consistent across all admin listing pages.
- **Profile Management**: Update personal profile and password.

### **7️⃣ General UI/UX Enhancements**

- Role-based navigation with profile dropdown.
- Interactive elements: carousels, dynamic ride cards, and responsive charts.
- Skeleton and smooth transitions for enhanced perceived performance and global error handling.
- No broken links or non-functional buttons.
- Accessibility-compliant components and semantic HTML.
- Lazy-loading for heavy assets (maps, large tables).
- Data visualization components like cards, bar charts, pie charts, and tables—all dynamically updated.
- **Emergency / SOS Button** (navigator.geolocation/react-geolocated/leaflet +emailjs/whatsapp-web.js/twilio)
  - Purpose: Enhance rider and driver safety by providing a quick way to call for help during a ride.
  - Steps:
    1. **Button Placement** – Floating SOS button visible on the active ride screen.
    2. **Emergency Options** – On click, show options: _Call Police_, _Notify Emergency Contact_, _Share Live Location_.
    3. **Pre-set Emergency Contact** – Users can save trusted contacts in settings for quick notifications.
    4. **Live Location Sharing** – Automatically send GPS link to selected contacts when SOS is triggered.
    5. **Visual Feedback** – Show confirmation messages like “Emergency contact notified” or “Location shared successfully”.
  - Implementation Details:
    - Only visible during an active ride.
    - Uses `map` to get current location.
    - Uses `tel:`, SMS, or WhatsApp API for notifications.
    - Ensure floating button styled to match the site’s theme.
  - Additional Options:
    - Emergency contacts editable in **Settings → Safety**.
    - Can extend to multiple contacts or different emergency numbers.
- **Strict Error Handling (⚠️ Mandatory for Full Marks)**:
  - All **forms must implement proper validation and error messages** (e.g., required fields, invalid email, password mismatch).
  - Clear and user-friendly error messages for network/API failures, validation errors, and unauthorized actions.
  - Toast/alert message for both success and error states (e.g., `react-hot-toast`).
  - ⚠️ **Important:** If you fail to handle form validation errors or API errors properly, **your marks will be significantly reduced.**

---

### **Submission Guidelines**

1. **Codebase**
   - Clean, modular codebase following best practices.
   - Comprehensive README.md including:
     - Live deployment link
     - Project overview
     - Project features
     - Technology stack
     - Setup instructions
     - Any other relevant notes
2. **GitHub Repository**
   - Separate repositories for Frontend and Backend.
   - Commit history showing development progress (minimum 10 meaningful commit messages for each frontend and backend repo; otherwise, you will get 0).
3. **Live Deployment**
   - Provide live deployment URLs for both frontend and backend.
4. **Demo video** (10-15 minutes) walkthrough covering:
   - Registration and login (all roles)
   - Rider booking process with live tracking
   - Driver ride acceptance and completion
   - Rider/Driver/Admin management features
5. **Credentials**
   - Provide admin/driver/rider login details (email & password) for testing
