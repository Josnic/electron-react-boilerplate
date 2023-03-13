import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './MyTheme';
import './styles/globals.scss';
import Home from './pages/Home';

export default function App() {
  return (
    <ThemeProvider theme={MyTheme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
