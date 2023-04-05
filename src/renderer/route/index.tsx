import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

import MyTheme from '../MyTheme';
import Login from "../pages/Login"; 
import Register from "../pages/Register"; 
import Home from "../pages/Home";

import { useSelector } from 'react-redux';

function ProtectedRoute ({ children }) {
  const authState = useSelector((state) => state);
  const location = useLocation();
  if (!authState.auth.isAuthenticated ||  authState.auth.token === "") {
      return <Navigate to="/" replace state={{ path: location.pathname }} />;
  }
  return children;
};


const RouteApp = () =>{
  return (
    <ThemeProvider theme={MyTheme}>
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    </ThemeProvider>
  );
}

export default RouteApp;