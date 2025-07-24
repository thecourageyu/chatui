import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
// const LOGIN_PROXY_PATH = "loginserver"
const LOGIN_PROXY_PATH = "http://localhost:3001"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // const login = async (email, password) => {
    
  //   const res = await axios.post(`${LOGIN_PROXY_PATH}/login`, { email, password });
  //   const token = res.data.token;
  //   localStorage.setItem('token', token);
  //   await fetchUser({ email, password });

  // };


  // const login = async (email, password) => {s
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${LOGIN_PROXY_PATH}/login`, { email, password });

      const token = res.data.token;
      localStorage.setItem('token', token);

      await fetchUser({ email, password });
      console.log('AuthProvider:login successful:');

      return { success: true };  // ✅ Login successful

    } catch (err) {
      console.error('AuthProvider:login failed!', err.response?.data || err.message);

      // You can extract the status or error message
      if (err.response?.status === 401 || err.response?.status === 403) {
        return { success: false, message: 'Invalid credentials' };
      }

      return { success: false, message: 'Server error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const fetchUser = async (userData) => {
  // const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('AuthProvider:fetchUser token not found!');
      return;
    }

    try {
      // const res = await axios.get('http://localhost:3001/me', {
      const res = await axios.get(`${LOGIN_PROXY_PATH}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({ id: res.data.userId, name: userData.email });
      // setUser({ id: res.data.userId });
      // console.log(`fetchUser: what the User: ${user.name}`);
      console.log(`AuthProvider:fetchUser after setUser => ${res.data.userId}`);  // decoded.userId
      // return true;
    } catch(err) {
      logout();
      console.log(`fetchUser: logout\n${err}`);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// export const useAuth = () => useContext(AuthContext);
export default AuthContext;
export function useAuth() {
  return useContext(AuthContext);
}
// import { createContext, useContext, useState } from 'react';

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);

//   const login = (userData) => setUser(userData);
//   const logout = () => setUser(null);

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }

// export default AuthContext;