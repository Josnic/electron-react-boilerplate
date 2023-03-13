import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
  palette: {
    type: 'light',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    }
  },
};

export default createTheme(themeOptions);