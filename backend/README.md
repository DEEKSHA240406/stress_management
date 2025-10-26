# Mental Wellness API - Flask Backend

A Flask-based REST API for the Mental Wellness application with JWT authentication and MongoDB integration.

## Features

- **Authentication**: JWT-based authentication with login/register functionality
- **Database**: MongoDB integration with PyMongo
- **Security**: Password hashing with bcrypt, input validation
- **CORS**: Cross-origin resource sharing enabled
- **Error Handling**: Comprehensive error handling and logging
- **Documentation**: Built-in API documentation endpoint

## Tech Stack

- **Framework**: Flask 3.0.0
- **Database**: MongoDB
- **Authentication**: Flask-JWT-Extended
- **Password Hashing**: bcrypt
- **CORS**: Flask-CORS
- **Environment**: python-dotenv

## Prerequisites

- Python 3.8+
- MongoDB (local or cloud instance)
- pip (Python package manager)

## Installation

1. **Clone the repository** (if not already done)
   ```bash
   git clone <repository-url>
   cd stress_management/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env file with your configuration
   ```

5. **Configure MongoDB**
   - Make sure MongoDB is running locally on port 27017, or
   - Update `MONGODB_URI` in `.env` file with your MongoDB connection string

6. **Run the application**
   ```bash
   python app.py
   ```

## Environment Configuration

Create a `.env` file with the following variables:

```env
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-change-this-in-production

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key-change-this-in-production
JWT_ACCESS_TOKEN_EXPIRES=7

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/mental_wellness_db
MONGODB_DATABASE=mental_wellness_db

# CORS Configuration
CORS_ORIGINS=*

# Server Configuration
PORT=3000
HOST=0.0.0.0
```

## API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/verify` | Verify JWT token | Yes |
| POST | `/api/auth/logout` | Logout user | No |
| POST | `/api/auth/forgot-password` | Send password reset email | No |
| POST | `/api/auth/reset-password` | Reset password with token | No |
| GET | `/api/auth/users` | Get all users (admin only) | Yes (Admin) |

### General Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| GET | `/api/health` | Health check |
| GET | `/api/docs` | API documentation |

## Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "role": "student"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Verify token
```bash
curl -X GET http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Test Users

The application automatically creates test users on startup:

- **Student**: `student@test.com` / `password123`
- **Admin**: `admin@test.com` / `admin123`

## Password Requirements

- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Development

### Running in Development Mode
```bash
export FLASK_ENV=development
python app.py
```

### Project Structure
```
backend/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── env.example           # Environment variables template
├── config/
│   ├── config.py         # Flask configuration
│   └── db.py            # Database configuration
├── models/
│   └── User.py          # User model
├── controllers/
│   └── authController.py # Authentication controller
├── routes/
│   └── authRoutes.py    # Authentication routes
├── middleware/
│   └── authMiddleware.py # JWT middleware
└── utils/
    └── validators.py    # Validation utilities
```

## Production Deployment

1. **Set production environment variables**
2. **Use a production WSGI server** (e.g., Gunicorn)
3. **Set up MongoDB Atlas** or production MongoDB instance
4. **Configure proper CORS origins**
5. **Use environment-specific secret keys**

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **Import Errors**
   - Ensure virtual environment is activated
   - Check Python path and module imports

3. **JWT Token Issues**
   - Verify JWT_SECRET_KEY is set
   - Check token expiration settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
