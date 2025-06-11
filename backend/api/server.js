const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;
const SECRET = 'your-secret-key';

app.use(cors());
app.use(bodyParser.json());

// Dummy user
const mockUser = {
  username: 'admin',
  password: '1234',
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === mockUser.username && password === mockUser.password) {
    const token = jwt.sign({ username }, SECRET, { expiresIn: '60s' }); // expires in 60s for demo
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'This is protected data', user: req.user });
});

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
