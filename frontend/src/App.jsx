// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import ChatUI from "./components/ChatUI";
import ChatUI2 from "./components/ChatUI2";
// import Demo from "./components/LoginPage";

// import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
// import Dashboard from './Dashboard';

// import { useAuth } from './components/AuthContext';  // <-- import it
// import { AuthProvider, useAuth } from './components/AuthContext';
import { AuthProvider } from './components/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
// ReactDOM.createRoot(document.getElementById('root')).render(
  return(
    <BrowserRouter>
      <AuthProvider>
        
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/chat2" element={<ChatUI2 />} />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                {/* <ChatUI user={'YZK'}/> */}
                {/* <ChatUI user={user?.name || 'Guest'} /> */}
                <ChatUI />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
// );
}


// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useState } from 'react';

// import ChatUI from "./components/ChatUI";
// import Demo from "./components/LoginPage";
// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Demo />} /> 
//         <Route path="/login" element={<Demo setAuth={setIsAuthenticated} />} />

//         {/* 🔐 Protected Routes */}
//         {/* <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}> */}
//         <Route path="/chat" element={<ChatUI user={'YZK'}/>} />
//         {/* </Route> */}
//       </Routes>
//     </Router>
//     // <>
//     //   <ChatUI />
//     //   <Demo />
//     // </>
//   );
// }

export default App;
