import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';
import type {} from '@mui/lab/themeAugmentation';
import '@mui/lab/themeAugmentation';

export const themeOptions: ThemeOptions = {
  palette: {
    type: 'light',
    primary: {
      main: '#005375',
    },
    secondary: {
      main: '#1285AB',
    }
  },
  components: {
    MuiTimeline: {
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
      },
    },
  },
};

export default createTheme(themeOptions);