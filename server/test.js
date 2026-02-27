const { spawn } = require('child_process');
const axios = require('axios');

// Start server
const server = spawn('node', ['server.js'], { cwd: __dirname });

server.stdout.on('data', (data) => {
  console.log(`Server: ${data}`);
});

server.stderr.on('data', (data) => {
  console.error(`Server Error: ${data}`);
});

// Wait for server to start
setTimeout(async () => {
  try {
    // Test register
    console.log('Testing register...');
    const registerResponse = await axios.post('https://backend.neurocruit.ai/api/auth/register', {
      name: 'Test User',
      email: 'test2@example.com',
      password: 'password123'
    });
    console.log('Register response:', registerResponse.data);

    // Test login
    console.log('Testing login...');
    const loginResponse = await axios.post('https://backend.neurocruit.ai/api/auth/login', {
      email: 'test2@example.com',
      password: 'password123'
    });
    console.log('Login response:', loginResponse.data);

    const token = loginResponse.data.token;

    // Test get profile
    console.log('Testing get profile...');
    const profileResponse = await axios.get('https://backend.neurocruit.ai/api/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Profile response:', profileResponse.data);

    // Test update profile
    console.log('Testing update profile...');
    const updateResponse = await axios.put('https://backend.neurocruit.ai/api/profile', {
      fullName: 'Updated Test User',
      headline: 'Test Developer',
      location: 'Test City'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Update response:', updateResponse.data);

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  } finally {
    server.kill();
  }
}, 3000);