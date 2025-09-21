# My Node.js API Application

A comprehensive Node.js REST API server with user management, product management, and utility endpoints.

## 🚀 Features

- **User Management**: CRUD operations for users
- **Product Management**: CRUD operations for products  
- **Health Monitoring**: Health check and status endpoints
- **Search Functionality**: Search users and products
- **Error Handling**: Comprehensive error responses
- **CORS Support**: Cross-origin resource sharing enabled

## 📋 API Endpoints

### Health & Status
- `GET /api/health` - Health check endpoint
- `GET /api/status` - Server status and information

### User Management
- `GET /api/users` - Get all users (supports ?role=admin&limit=10)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/bulk` - Bulk create users

### Product Management
- `GET /api/products` - Get all products (supports ?category=Electronics&limit=10&minPrice=100&maxPrice=500)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Search
- `GET /api/search/users?q=searchterm` - Search users by name or email
- `GET /api/search/products?q=searchterm` - Search products by name or category

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/skuma49/my-node-app.git
   cd my-node-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   # Production
   npm start
   
   # Development (with auto-reload)
   npm run dev
   ```

4. **Test the APIs**
   ```bash
   npm test
   ```

## 📝 API Usage Examples

### Health Check
```bash
curl http://localhost:3001/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-09-21T12:00:00.000Z",
  "uptime": 120.5,
  "version": "1.0.0"
}
```

### Create User
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  },
  "message": "User created successfully"
}
```

### Get Users with Filters
```bash
curl "http://localhost:3001/api/users?role=admin&limit=5"
```

### Create Product
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Mouse",
    "price": 79.99,
    "category": "Electronics",
    "stock": 25
  }'
```

### Search Products
```bash
curl "http://localhost:3001/api/search/products?q=gaming"
```

### Get Products with Filters
```bash
curl "http://localhost:3001/api/products?category=Electronics&minPrice=50&maxPrice=100"
```

## 🧪 Testing

The application includes comprehensive API tests:

```bash
# Run all tests
npm test

# Or run the test file directly
node test-apis.js
```

## 📊 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message"
}
```

## 🔒 Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## 🌐 Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment mode (development/production)

## 📦 Dependencies

- **express**: Web framework for Node.js
- **cors**: Cross-Origin Resource Sharing middleware
- **nodemon**: Development dependency for auto-reload

## 🏗️ Project Structure

```
my-node-app/
├── enhanced-server.js    # Main server file
├── test-apis.js         # API test suite
├── package.json         # Dependencies and scripts
├── README.md           # This file
└── catalog-info.yaml   # Backstage catalog metadata
```

## 🚀 Deployment

This application can be deployed to various platforms:

### Heroku
```bash
git push heroku main
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/skuma49/my-node-app/issues) page
2. Create a new issue if your problem isn't listed
3. Provide detailed information about your environment and the issue

## 🔄 Changelog

### v1.0.0
- Initial release with user and product management
- Health check and status endpoints
- Search functionality
- Comprehensive error handling
- API testing suite
