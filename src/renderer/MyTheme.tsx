import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';
import type {} from '@mui/lab/themeAugmentation';
import '@mui/lab/themeAugmentation';

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