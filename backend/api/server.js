/*
npm install express cors bcrypt jsonwebtoken mongoose
*/

import { hash, compare } from 'bcrypt';
// import bodyParser from 'body-parser';
import cors from 'cors';
import express, { json } from 'express';
import { readFileSync } from 'fs';

import { Schema, model, connect } from 'mongoose';

// import { sign, verify } from 'jsonwebtoken';
import pkg from 'jsonwebtoken';
// import { add } from 'winston';
const { sign, verify } = pkg;

const app = express();
const PORT = 3001;
const JWT_SECRET = 'gogogorockandroll';

app.use(cors());
app.use(json());


// MongoDB user schema
const UserSchema = new Schema({
  email: String,
  passwordHash: String,
});

const User = model('User', UserSchema, 'LoginCollection');

const credentials = JSON.parse(readFileSync('./etc/credentials.json'));
const url = `mongodb://${credentials.username}:${credentials.password}@mongo:27017`;  // mongo server

// connect('mongodb://localhost:27017/chatdb');
connect(url);

// Register endpoint
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const passwordHash = await hash(password, 10);
  const user = new User({ email, passwordHash });
  console.log(`/server/register ... ${email}`)

  await user.save();
  return res.send({ message: 'User registered' });
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !compare(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  console.log(`api: /server/login; email: ${email}`)

  const token = sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  return res.json({ token });
});

// Protected route
app.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (!token) {
    console.error('api: /server/me token not found!')
    return res.sendStatus(401);
  }

  try {
    const decoded = verify(token, JWT_SECRET);
    console.log(`api: /server/me verify successful! ${decoded}`)
    return res.json({ userId: decoded.userId });
    
  } catch (err) {
    console.error(`api: /server/me verify failed! ${err}`)
    return res.sendStatus(403);
    
  }
});


// ✅ Add this test endpoint
app.get('/ping', (req, res) => {
  return res.send('pong');
});


function addUser(email, password) {
  fetch('http://localhost:3001/register',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
}

async function run(email) {

  console.log('✅ Connected to MongoDB');

  // const email = 'test@example.com';
  const password = 'ev123';


  // Add user
  const existing = await User.findOne({ email });
  if (!existing) {
    const passwordHash = await hash(password, 10);
    const user = new User({ email, passwordHash });
    await user.save();
    console.log('✅ User added:', email);
  } else {
    console.log('⚠️ User already exists:', email);
  }

  // Delete user
  // const deleted = await User.deleteOne({ email });
  // if (deleted.deletedCount > 0) {
  //   console.log('🗑️ User deleted:', email);
  // } else {
  //   console.log('❌ No user found to delete');
  // }

  // await mongoose.disconnect();
  // console.log('🔌 Disconnected from MongoDB');

}



const cmd = "fetch('http://localhost:3001/ping').then(res => res.text()).then(console.log).catch(console.error);"
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Test endpoint:\n${cmd}`)


  const fruits = ['ev01', 'ev02', 'ev03', 'yzk'];
  

  for (let i = 0; i < fruits.length; i++) {
    
    const email = fruits[i]
    console.log(email);
  //   const user = User.findOne({ email: name });
    
  //   if (!user) {
  //     addUser(user, 'ev123');
  //   } else {
  //     console.log("next");
  //   }
    run(email);
    // run().catch(err => console.error('❌ Error:', err));
  }
});
