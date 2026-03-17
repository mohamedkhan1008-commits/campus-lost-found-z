# Campus Lost & Found Web Portal

A complete web application for college students to report and find lost or found items on campus.

## 🎯 Features

✅ **User Authentication** - Signup and Login with JWT tokens
✅ **Report Lost Items** - Post details about lost belongings
✅ **Report Found Items** - Post details about found items
✅ **Browse Items** - View all lost and found items with filters
✅ **User Dashboard** - Manage your posted items and statistics
✅ **Contact System** - Email integration to contact item posters
✅ **Responsive Design** - Works on all devices (desktop, tablet, mobile)
✅ **No Framework** - Pure HTML, CSS, and JavaScript

## 📋 Project Structure

```
campus-lost-found/
├── frontend/
│   ├── index.html                 (Home page)
│   ├── login.html                 (Login page)
│   ├── signup.html                (Sign up page)
│   ├── dashboard.html             (User dashboard)
│   ├── report-lost.html           (Report lost item)
│   ├── report-found.html          (Report found item)
│   ├── view-lost.html             (View lost items)
│   ├── view-found.html            (View found items)
│   ├── contact.html               (Contact & Help page)
│   ├── css/
│   │   └── style.css              (All styling)
│   ├── js/
│   │   ├── api.js                 (API utility functions)
│   │   ├── auth.js                (Authentication logic)
│   │   ├── items.js               (Items management)
│   │   └── dashboard.js           (Dashboard functions)
│   └── package.json
│
└── backend/
    ├── server.js                  (Express server)
    ├── config/
    │   └── db.js                  (MongoDB connection)
    ├── models/
    │   ├── User.js                (User schema)
    │   └── Item.js                (Item schema)
    ├── routes/
    │   ├── auth.js                (Authentication endpoints)
    │   ├── items.js               (Item endpoints)
    │   └── users.js               (User endpoints)
    ├── middleware/
    │   └── auth.js                (JWT verification)
    ├── package.json
    ├── .env                       (Environment variables)
    └── .gitignore
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- MongoDB (Local or Atlas)
- Any modern web browser (Chrome, Firefox, Edge, Safari)

### Installation & Setup

#### 1. **MongoDB Setup**

Option A: **Local MongoDB**
```bash
# Install MongoDB locally from https://www.mongodb.com/try/download/community
# Start MongoDB service

# Windows:
mongod

# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

Option B: **MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Update it in `.env` file

#### 2. **Backend Setup**

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (already created, just update if needed)
# Update MONGODB_URI if using MongoDB Atlas

# Start the backend server
npm start

# Server will run on http://localhost:5000
```

#### 3. **Frontend Setup**

The frontend doesn't require npm installation. You can serve it directly:

```bash
# Option 1: Using VS Code Live Server
# Install VS Code extension: "Live Server" by Ritwick Dey
# Right-click on index.html -> "Open with Live Server"
# Frontend will open at http://localhost:5500 or http://127.0.0.1:5500

# Option 2: Using Python's built-in server
cd frontend
python -m http.server 8000
# Frontend will run at http://localhost:8000

# Option 3: Using Node.js http-server (optional)
npm install -g http-server
http-server frontend
```

### Running the Application

1. **Start MongoDB** (if using local installation)
2. **Start Backend**:
   ```bash
   cd backend
   npm start
   ```
   Output: `Server running on http://localhost:5000`

3. **Start Frontend**:
   - Use VS Code Live Server, or
   - Use Python/Node.js server (see above)

4. **Open Browser**:
   ```
   http://localhost:5500  (or your frontend port)
   ```

## 📚 API Routes

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/verify` - Verify JWT token

### Items
- `GET /api/items` - Get all items (with filters)
- `GET /api/items?type=lost` - Get lost items
- `GET /api/items?type=found` - Get found items
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item (requires auth)
- `DELETE /api/items/:id` - Delete item (requires auth)
- `PUT /api/items/:id/status` - Update item status (requires auth)

### Users
- `GET /api/users/dashboard` - Get user dashboard data (requires auth)
- `GET /api/users/profile` - Get user profile (requires auth)
- `PUT /api/users/profile` - Update user profile (requires auth)

## 🔐 Environment Variables

Backend `.env` file:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/campus-lost-found

# JWT Secret
JWT_SECRET=your_jwt_secret_key_change_this_in_production_12345

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

## 📝 How to Use

### 1. **Home Page**
- View site statistics
- See recent items
- Learn about the platform

### 2. **Sign Up**
- Click "Sign Up" button
- Fill in details (Full Name, Username, Email, Password)
- Create account
- Automatically logged in and redirected to dashboard

### 3. **Log In**
- Click "Login" button
- Enter email and password
- Get JWT token stored in browser
- Redirected to dashboard

### 4. **Report Lost Item**
- Go to "Report Lost Item" page
- Fill item details:
  - Title
  - Category
  - Date Lost
  - Location
  - Description (detailed info)
  - Image URL (optional)
- Submit form
- Item posted and visible to others

### 5. **Report Found Item**
- Go to "Report Found Item" page
- Same as above but for found items
- Owner can contact you directly

### 6. **View Items**
- Go to "Lost Items" or "Found Items"
- Browse all items with images
- Filter by category
- Search by title or location
- Click "Contact Poster" to email them

### 7. **Dashboard**
- View your profile
- See statistics (items posted, active, resolved)
- Manage your items:
  - Mark as resolved
  - Delete items
- View site-wide statistics

### 8. **Contact & Help**
- View contact information
- Send message (simulated)
- Read FAQs

## 🧪 Testing the Application

### Test User Account (after signup)
```
Username: testuser
Email: test@example.com
Password: password123
```

### Test Items
1. Post a "lost" item with all details
2. Post a "found" item
3. View both on respective pages
4. Filter by category
5. Search functionality
6. Delete items from dashboard

## 🛠️ Technology Stack

### Frontend
- HTML5
- CSS3 (Responsive, Flexbox, CSS Grid)
- Vanilla JavaScript (ES6+)
- No frameworks or libraries

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose (ODM)
- JWT (JSON Web Tokens)
- bcryptjs (Password hashing)

## 📱 Responsive Design

The application is fully responsive and tested on:
- ✅ Desktop (1920px and above)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)

## ⚠️ Important Notes

1. **CORS Enabled** - Backend allows requests from any origin (development only)
2. **JWT Tokens** - Stored in browser's localStorage
3. **Password Security** - Passwords are hashed with bcrypt
4. **Image URLs** - Use external URLs or upload to cloud service
5. **Email System** - Uses mailto links (no email server needed)

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running: `mongod` or use MongoDB Atlas
- Update MONGODB_URI in .env file
- Ensure MongoDB server is accessible

### CORS Error
- Backend is set to accept all origins
- Check if backend is running on port 5000
- Check browser console for detailed error

### Token Expired
- Logout and login again
- Token valid for 7 days

### Items Not Loading
- Check network tab in browser DevTools
- Verify backend is running
- Check API endpoints in browser console

### Port Already in Use
- Change port in `.env` (backend)
- Use different port for frontend server

## 📖 Documentation for College Submission

### Key Features Explained:

1. **Authentication System**
   - Secure password hashing with bcrypt
   - JWT token-based authentication
   - Automatic token verification on protected routes

2. **Database Design**
   - User collection with unique constraints
   - Item collection with proper indexing
   - Foreign key relationships between Users and Items

3. **RESTful API**
   - Proper HTTP methods (GET, POST, PUT, DELETE)
   - Standard response format with success/error handling
   - Input validation on all endpoints

4. **Frontend Architecture**
   - Modular JavaScript with separate concerns
   - Utility functions for API calls
   - Responsive CSS with mobile-first approach
   - Progressive enhancement

5. **Code Quality**
   - Inline comments explaining functionality
   - Consistent naming conventions
   - Error handling and user feedback
   - Security best practices

## 🎓 Learning Outcomes

By studying this project, you'll learn:
- Full-stack web development
- RESTful API design
- Database modeling with MongoDB
- Authentication and authorization
- Responsive web design
- JavaScript async/await with Fetch API
- Express.js fundamentals
- CSS Grid and Flexbox

## 📄 License

MIT License - Feel free to use for educational purposes

## 👨‍💻 Author

Created as a college mini project for learning full-stack web development.

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review inline code comments
3. Check browser console for errors
4. Check backend logs for server errors

---

**Happy Coding! 🚀**

