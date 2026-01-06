SampleShop – E-Commerce Mobile Application
Abstract

SampleShop is a mobile-based e-commerce application developed using React Native and Expo. The application demonstrates a complete shopping workflow including user authentication, product browsing, cart management, checkout, and order history tracking. Firebase services are used to handle authentication and persistent data storage. The project emphasizes modular architecture, scalable state management, and real-world application design principles.

Objectives

The primary objective of this project is to design and implement a functional e-commerce mobile application that reflects real-world shopping behavior. The application aims to provide a seamless user experience while maintaining clean separation of concerns, reusable components, and secure backend integration.

Key Features

• User authentication using Firebase Authentication
• Product listing with search functionality
• Dynamic cart management with quantity controls
• Persistent cart and order state using Context API
• Secure checkout workflow with address management
• Order history retrieval per authenticated user
• Light and dark theme support
• Toast-based feedback for user actions

Technology Stack

• React Native
• Expo Router
• Firebase Authentication
• Firebase Firestore
• JavaScript (ES6+)

System Architecture

The application follows a component-based architecture using Expo Router for navigation. Global state management is implemented using React Context Providers for authentication, cart data, and theming. Firebase Firestore is used as a NoSQL backend for storing user profiles, addresses, and order history.

Project Structure overview
app/
  (drawer)/
      products/
         [id].js
         index.js
      cart.js
      profile.js
      _layout.js
   order-history.js
   login.js
   register.js
   _layout.js
   checkout.js
   login.js
   order-success.js
   signup.js
   index.js

src/
   api/
      products.js
   auth/
      firebase.js
   context/
   AuthContext.js
   CartContext.js
   ThemeContext.js

Setup Instructions
1. Clone the Repository
git clone https://github.com/your-username/sampleshop.git
cd sampleshop

2. Install Dependencies
npm install

3. Run the code
npx expo start -c

Conclusion

This project successfully implements a full-stack mobile e-commerce application using modern frontend and backend technologies. The design focuses on scalability, maintainability, and real-world usability, making it suitable as an academic, internship, or interview-level submission.

Author

Name: Suyash Agarwal
Email: Suyash.agarwal2025@vitstudent.ac.in