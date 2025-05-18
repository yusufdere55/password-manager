# My Accounts - Password Manager

A secure password manager application built with React and Node.js.

## Features

- User authentication
- Secure password storage
- Password categories
- Profile management
- Account suspension

## Tech Stack

- Frontend: React, TailwindCSS
- Backend: Node.js, Express
- Database: MS SQL Server
- Authentication: JWT

## Installation

1. Clone the repository
```bash
git clone https://github.com/yusufdere55/password-manager.git
cd password-manager
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Environment Setup

Backend (.env):
```env
PORT=5001
JWT_SECRET=your_jwt_secret
DB_SERVER=your_db_server
DB_DATABASE=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```

Frontend (.env):
```env
VITE_API_URL=http://localhost:5001/api
```

4. Run the application
```bash
# Run backend
cd backend
npm run dev

# Run frontend
cd frontend
npm run dev
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
