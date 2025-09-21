// Enhanced Node.js API Server with Multiple Endpoints
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data storage for demo purposes
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' }
];

let products = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics', stock: 50 },
  { id: 2, name: 'Book', price: 19.99, category: 'Education', stock: 100 }
];

// Utility functions
const generateId = (array) => Math.max(...array.map(item => item.id), 0) + 1;

// ===== HEALTH CHECK ENDPOINTS =====
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    server: 'my-node-app',
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api/health',
      'GET /api/status',
      'GET /api/users',
      'POST /api/users',
      'GET /api/users/:id',
      'PUT /api/users/:id',
      'DELETE /api/users/:id',
      'GET /api/products',
      'POST /api/products',
      'GET /api/products/:id',
      'PUT /api/products/:id',
      'DELETE /api/products/:id'
    ]
  });
});

// ===== USER MANAGEMENT ENDPOINTS =====

// Get all users
app.get('/api/users', (req, res) => {
  const { role, limit } = req.query;
  let filteredUsers = users;
  
  if (role) {
    filteredUsers = users.filter(user => user.role === role);
  }
  
  if (limit) {
    filteredUsers = filteredUsers.slice(0, parseInt(limit));
  }
  
  res.json({
    success: true,
    data: filteredUsers,
    count: filteredUsers.length
  });
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  res.json({
    success: true,
    data: user
  });
});

// Create new user
app.post('/api/users', (req, res) => {
  const { name, email, role } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: 'Name and email are required'
    });
  }
  
  const newUser = {
    id: generateId(users),
    name,
    email,
    role: role || 'user'
  };
  
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    data: newUser,
    message: 'User created successfully'
  });
});

// Update user
app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  const { name, email, role } = req.body;
  
  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;
  if (role) users[userIndex].role = role;
  
  res.json({
    success: true,
    data: users[userIndex],
    message: 'User updated successfully'
  });
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  users.splice(userIndex, 1);
  
  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

// ===== PRODUCT MANAGEMENT ENDPOINTS =====

// Get all products
app.get('/api/products', (req, res) => {
  const { category, limit, minPrice, maxPrice } = req.query;
  let filteredProducts = products;
  
  if (category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (minPrice) {
    filteredProducts = filteredProducts.filter(product => 
      product.price >= parseFloat(minPrice)
    );
  }
  
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(product => 
      product.price <= parseFloat(maxPrice)
    );
  }
  
  if (limit) {
    filteredProducts = filteredProducts.slice(0, parseInt(limit));
  }
  
  res.json({
    success: true,
    data: filteredProducts,
    count: filteredProducts.length
  });
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  res.json({
    success: true,
    data: product
  });
});

// Create new product
app.post('/api/products', (req, res) => {
  const { name, price, category, stock } = req.body;
  
  if (!name || !price || !category) {
    return res.status(400).json({
      success: false,
      error: 'Name, price, and category are required'
    });
  }
  
  const newProduct = {
    id: generateId(products),
    name,
    price: parseFloat(price),
    category,
    stock: parseInt(stock) || 0
  };
  
  products.push(newProduct);
  
  res.status(201).json({
    success: true,
    data: newProduct,
    message: 'Product created successfully'
  });
});

// Update product
app.put('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  const { name, price, category, stock } = req.body;
  
  if (name) products[productIndex].name = name;
  if (price) products[productIndex].price = parseFloat(price);
  if (category) products[productIndex].category = category;
  if (stock !== undefined) products[productIndex].stock = parseInt(stock);
  
  res.json({
    success: true,
    data: products[productIndex],
    message: 'Product updated successfully'
  });
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  products.splice(productIndex, 1);
  
  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// ===== BULK OPERATIONS =====

// Bulk user operations
app.post('/api/users/bulk', (req, res) => {
  const { operation, data } = req.body;
  
  if (operation === 'create' && Array.isArray(data)) {
    const newUsers = data.map(userData => ({
      id: generateId([...users, ...newUsers || []]),
      name: userData.name,
      email: userData.email,
      role: userData.role || 'user'
    }));
    
    users.push(...newUsers);
    
    res.status(201).json({
      success: true,
      data: newUsers,
      message: `${newUsers.length} users created successfully`
    });
  } else {
    res.status(400).json({
      success: false,
      error: 'Invalid bulk operation'
    });
  }
});

// ===== SEARCH ENDPOINTS =====

// Search users
app.get('/api/search/users', (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      error: 'Search query parameter "q" is required'
    });
  }
  
  const searchResults = users.filter(user => 
    user.name.toLowerCase().includes(q.toLowerCase()) ||
    user.email.toLowerCase().includes(q.toLowerCase())
  );
  
  res.json({
    success: true,
    data: searchResults,
    count: searchResults.length,
    query: q
  });
});

// Search products
app.get('/api/search/products', (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      error: 'Search query parameter "q" is required'
    });
  }
  
  const searchResults = products.filter(product => 
    product.name.toLowerCase().includes(q.toLowerCase()) ||
    product.category.toLowerCase().includes(q.toLowerCase())
  );
  
  res.json({
    success: true,
    data: searchResults,
    count: searchResults.length,
    query: q
  });
});

// ===== ROOT ENDPOINT =====
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to My Node.js API Server',
    version: '1.0.0',
    documentation: {
      health: 'GET /api/health',
      status: 'GET /api/status',
      users: 'GET /api/users',
      products: 'GET /api/products'
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 API Status: http://localhost:${PORT}/api/status`);
  console.log(`💓 Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
