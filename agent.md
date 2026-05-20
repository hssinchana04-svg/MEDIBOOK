# Work Done So Far

- **Application Deployment**: Deployed the full-stack application to Render and configured backend CORS rules to support the live frontend. Replaced dummy data with live API calls.
- **Environment Configuration**: Created `.env` file in the frontend to securely manage API base URLs and environment variables.
- **Database Integration**: Set up and verified the MongoDB connection via the `connectDB` function in `server.js`.
- **Database Seeding**: Created the `seed.js` script to securely hash passwords and populate MongoDB with initial doctor profiles.
- **Project Restructuring**: Reorganized the workspace by moving scattered backend files (`config`, `middleware`, `models`, `routes`, `server.js`, and `package.json`) into a dedicated `backend` directory.
- **API Centralization**: Created a central `api.js` configuration file in the frontend and refactored components to use it, removing hardcoded API URLs.
- **Appointment Booking Feature**: Refined the booking flow to properly capture user-selected dates and times and accurately assign patient details.
- **Version Control**: Initialized the Git repository, staged project files, and set up the remote connection to GitHub.
