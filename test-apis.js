#!/usr/bin/env node

// API Testing Script for My Node.js App
console.log('🧪 Starting API Tests for My Node.js App\n');

const BASE_URL = 'http://localhost:3001';

// Helper function to make HTTP requests
async function makeRequest(method, endpoint, data = null) {
  const url = `${BASE_URL}${endpoint}`;
  
  try {
    let response;
    
    if (method === 'GET') {
      response = await fetch(url);
    } else {
      response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : null
      });
    }
    
    const result = await response.json();
    
    return {
      status: response.status,
      success: response.ok,
      data: result
    };
  } catch (error) {
    return {
      status: 0,
      success: false,
      error: error.message
    };
  }
}

// Test function
function test(description, expected, actual) {
  const passed = actual === expected;
  console.log(`${passed ? '✅' : '❌'} ${description}`);
  if (!passed) {
    console.log(`   Expected: ${expected}, Got: ${actual}`);
  }
}

// Main test function
async function runTests() {
  console.log('=' .repeat(50));
  console.log('🔍 Testing Health & Status Endpoints');
  console.log('=' .repeat(50));
  
  // Test health endpoint
  const health = await makeRequest('GET', '/api/health');
  test('Health endpoint returns 200', 200, health.status);
  test('Health endpoint returns healthy status', 'healthy', health.data?.status);
  
  // Test status endpoint
  const status = await makeRequest('GET', '/api/status');
  test('Status endpoint returns 200', 200, status.status);
  test('Status has server name', 'my-node-app', status.data?.server);
  
  console.log('\n' + '=' .repeat(50));
  console.log('👥 Testing User Management Endpoints');
  console.log('=' .repeat(50));
  
  // Test get all users
  const users = await makeRequest('GET', '/api/users');
  test('Get users returns 200', 200, users.status);
  test('Users data is array', true, Array.isArray(users.data?.data));
  
  // Test create user
  const newUser = {
    name: 'Test User',
    email: 'test@example.com',
    role: 'user'
  };
  
  const createUser = await makeRequest('POST', '/api/users', newUser);
  test('Create user returns 201', 201, createUser.status);
  test('Created user has correct name', 'Test User', createUser.data?.data?.name);
  
  const userId = createUser.data?.data?.id;
  
  // Test get user by ID
  const getUser = await makeRequest('GET', `/api/users/${userId}`);
  test('Get user by ID returns 200', 200, getUser.status);
  test('Retrieved user has correct email', 'test@example.com', getUser.data?.data?.email);
  
  // Test update user
  const updateUser = await makeRequest('PUT', `/api/users/${userId}`, {
    name: 'Updated Test User'
  });
  test('Update user returns 200', 200, updateUser.status);
  test('Updated user has new name', 'Updated Test User', updateUser.data?.data?.name);
  
  // Test delete user
  const deleteUser = await makeRequest('DELETE', `/api/users/${userId}`);
  test('Delete user returns 200', 200, deleteUser.status);
  
  console.log('\n' + '=' .repeat(50));
  console.log('📦 Testing Product Management Endpoints');
  console.log('=' .repeat(50));
  
  // Test get all products
  const products = await makeRequest('GET', '/api/products');
  test('Get products returns 200', 200, products.status);
  test('Products data is array', true, Array.isArray(products.data?.data));
  
  // Test create product
  const newProduct = {
    name: 'Test Product',
    price: 29.99,
    category: 'Test Category',
    stock: 10
  };
  
  const createProduct = await makeRequest('POST', '/api/products', newProduct);
  test('Create product returns 201', 201, createProduct.status);
  test('Created product has correct name', 'Test Product', createProduct.data?.data?.name);
  
  const productId = createProduct.data?.data?.id;
  
  // Test get product by ID
  const getProduct = await makeRequest('GET', `/api/products/${productId}`);
  test('Get product by ID returns 200', 200, getProduct.status);
  test('Retrieved product has correct price', 29.99, getProduct.data?.data?.price);
  
  // Test update product
  const updateProduct = await makeRequest('PUT', `/api/products/${productId}`, {
    price: 39.99
  });
  test('Update product returns 200', 200, updateProduct.status);
  test('Updated product has new price', 39.99, updateProduct.data?.data?.price);
  
  // Test delete product
  const deleteProduct = await makeRequest('DELETE', `/api/products/${productId}`);
  test('Delete product returns 200', 200, deleteProduct.status);
  
  console.log('\n' + '=' .repeat(50));
  console.log('🔍 Testing Search Endpoints');
  console.log('=' .repeat(50));
  
  // Test search users
  const searchUsers = await makeRequest('GET', '/api/search/users?q=john');
  test('Search users returns 200', 200, searchUsers.status);
  
  // Test search products
  const searchProducts = await makeRequest('GET', '/api/search/products?q=laptop');
  test('Search products returns 200', 200, searchProducts.status);
  
  console.log('\n' + '=' .repeat(50));
  console.log('🚫 Testing Error Handling');
  console.log('=' .repeat(50));
  
  // Test 404 for non-existent user
  const notFound = await makeRequest('GET', '/api/users/999999');
  test('Non-existent user returns 404', 404, notFound.status);
  
  // Test invalid route
  const invalidRoute = await makeRequest('GET', '/api/invalid');
  test('Invalid route returns 404', 404, invalidRoute.status);
  
  console.log('\n' + '🎉 All tests completed!');
  console.log('\n' + '📋 Quick Test Commands:');
  console.log('curl http://localhost:3001/api/health');
  console.log('curl http://localhost:3001/api/users');
  console.log('curl http://localhost:3001/api/products');
  console.log('curl -X POST http://localhost:3001/api/users -H "Content-Type: application/json" -d \'{"name":"API Test","email":"api@test.com"}\'');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This test requires Node.js 18+ or you need to install node-fetch');
  console.log('Install with: npm install node-fetch');
  process.exit(1);
}

// Run tests
runTests().catch(console.error);
