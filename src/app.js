const express = require('express');
const helmet = require('helmet');

const app = express();

// Middleware to set security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [''self']",
      scriptSrc: [''self', 'unsafe-inline', 'unsafe-eval']",
      styleSrc: [''self', 'unsafe-inline']",
      imgSrc: [''self', 'data:']",
      fontSrc: [''self', 'data:']",
      connectSrc: [''self', 'https://api.example.com']",
      frameSrc: [''none']",
      objectSrc: [''none']",
      mediaSrc: [''self']",
      childSrc: [''none']",
      manifestSrc: [''self']"
    }
  },
  xssFilter: true,
  noSniff: true,
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  }
}));

// Example route controller
app.get('/', (req, res) => {
  try {
    res.send('<h1>Hello World</h1>');
  } catch (error) {
    console.error('Error in / route:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});