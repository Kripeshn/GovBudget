import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Dashboard from './pages/Admin/Dashboard';
import { useState } from 'react';
import RefrshHandler from './RefrshHandler';
import PageNotFound from './pages/PageNotFound';
import Budget from './pages/Admin/Budget';
import Expenses from './pages/Admin/Expenses';
import Feedback from './pages/Feedback';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // const role = localStorage.getItem('role'); // "0" for user, "1" for admin

  const PrivateRoute = ({ element, allowedRoles }) => {
    const role = localStorage.getItem('role');
  
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/unauthorized" />;
  
    return element;
  };
  

  return (
    <div className="App">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<PrivateRoute element={<Home />} allowedRoles={["0"]} />} />
        <Route path='/feedback' element={<PrivateRoute element={<Feedback />} allowedRoles={["0"]} />} />


        {/* Admin-only routes */}
        <Route path='/dashboard' element={<PrivateRoute element={<Dashboard />} allowedRoles={["1"]} />} />
        <Route path='/budget' element={<PrivateRoute element={<Budget />} allowedRoles={["1"]} />} />
        <Route path='/expenses' element={<PrivateRoute element={<Expenses />} allowedRoles={["1"]} />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
      
    </div>
  );
}

export default App;
