const http = require('http');
const data = JSON.stringify({ username: 'testuser', email: 'testuser@example.com', password: 'Test1234', fullName: 'Test User', phone: '+1111111111' });
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};
const req = http.request(options, res => {
  let response = '';
  res.on('data', chunk => response += chunk);
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    console.log('BODY', response);
  });
});
req.on('error', e => console.error('ERROR', e.message));
req.write(data);
req.end();
