// src/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    // const ok = login(email, password);
    const result = await login(email, password);
    console.log(JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('>>> login is ok!')
      navigate('/chat');
    } else {
      console.log('>>> login is not ok!')
      setError('帳號或密碼錯誤');  
    }

    // if (email === 'ev' && password === 'ev123') {
    //   login({ email }); // ✅ 設定使用者登入狀態
    //   // navigate('/dashboard');
    //   navigate('/chat');
    // } else {
    //   setError('帳號或密碼錯誤');
    // }
  };


  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
        <Typography variant="h5" align="center">登入</Typography>
        <form onSubmit={handleLogin}>
          <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
          <TextField label="密碼" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>登入</Button>
        </form>
      </Paper>
    </Container>
  );
}

// export default LoginPage;

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from './AuthContext';

// export default function LoginPage() {
//   const { login } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await login(email, password);
//     navigate('/');
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Login</h2>
//       <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
//       <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
//       <button type="submit">Login</button>
//     </form>
//   );
// }
