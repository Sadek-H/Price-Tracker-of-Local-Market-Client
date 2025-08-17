
# Price Tracker for Local Markets  

## Live Site

[View the live app here]( https://kachabazzarprice.netlify.app)  

A modern web application to track, compare, and analyze daily prices of products in local markets. Built with React, Vite, and a Node.js/Express backend.
 
## Features
- User authentication (sign up, login, protected routes)
- Role-based dashboards (Admin, Vendor, User)
- Track and visualize price trends for products
- Add, edit, and manage products and ads (Vendor/Admin)
- Watchlist and wishlist for users
- Responsive, modern UI with dark/light theme support
- Real-time data fetching from the backend

## Getting Started


### Installation
1. Clone the repository:
	```sh
	git clone https://github.com/Sadek-H/Price-Tracker-of-Local-Market-Client.git
	cd Price-Tracker-of-Local-Market-Client/price-tracker for local markets
	```
2. Install dependencies:
	```sh
	npm install
	# or
	yarn install
	```
3. Start the development server:
	```sh
	npm run dev
	# or
	yarn dev
	```
4. Open your browser and go to `http://localhost:5173`

## Project Structure
```
price-tracker for local markets/
├── public/           # Static assets
├── src/
│   ├── Components/   # Reusable UI components
│   ├── Pages/        # Page components (Home, Dashboard, Auth, etc.)
│   ├── Layout/       # Layout components
│   ├── context/      # React context (Auth, Theme, etc.)
│   ├── Provider/     # Context providers
│   ├── Routes/       # Route definitions and guards
│   └── assets/       # Images, icons, etc.
├── package.json
├── vite.config.js
└── README.md
```

## Environment Variables
Create a `.env` file in the root directory and add any required environment variables (API endpoints, etc.).

## Backend
This project connects to a backend API (see code for endpoints). Make sure the backend server is running and accessible.

## License
MIT

---
Made with ❤️ by Sadek-H and contributors.
