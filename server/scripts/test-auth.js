/**
 * Test script for authentication system
 */

const http = require('http');

const testData = JSON.stringify({
  username: 'testuser789',
  email: 'rashmikanawanjanadf@gmail.com',
  password: 'test1234',
  district: 'Colombo',
  dsDivision: 'Colombo',
  gnDivision: 'Borella'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': testData.length
  }
};

console.log('Testing registration with email verification...\n');

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', JSON.parse(data));
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.write(testData);
req.end();
