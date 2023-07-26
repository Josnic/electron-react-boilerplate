import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

import MyTheme from '../MyTheme';
import Welcome from '../pages/Welcome';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import CourseHome from '../pages/CourseHome';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children }) {
  const authState = useSelector((state) => state);
  const location = useLocation();
  if (!authState.auth.isAuthenticated || !authState.auth.user) {
    return <Navigate to="/" replace state={{ path: location.pathname }} />;
  }
  return children;
}

const RouteApp = () => {
  return (
    <ThemeProvider theme={MyTheme}>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course/:courseCode"
            element={
              <ProtectedRoute>
                <CourseHome />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default RouteApp;
