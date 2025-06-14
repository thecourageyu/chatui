import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import PrivateRoute from './PrivateRoute';
// import Dashboard from './pages/Dashboard';
// import Login from './pages/Login';
// import Home from './pages/Home';
import { useState } from 'react';

import ChatUI from "./components/ChatUI";
import Demo from "./components/LoginPage";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Demo />} /> 
        <Route path="/login" element={<Demo setAuth={setIsAuthenticated} />} />

        {/* 🔐 Protected Routes */}
        {/* <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}> */}
        <Route path="/chat" element={<ChatUI user={'YZK'}/>} />
        {/* </Route> */}
      </Routes>
    </Router>
    // <>
    //   <ChatUI />
    //   <Demo />
    // </>
  );
}

export default App;
