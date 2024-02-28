import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import store from './redux/store';

import App from './components/App/App';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import '@fontsource-variable/nunito';



const themeOption = {
  palette: {
    mode: 'light',
    primary: {
      main: '#166088',
    },
    secondary: {
      main: '#B36D55',
    },
    error: {
      main: '#994636',
    },
    background: {
      default: '#ffebcd',
      paper: '#fff4e9',
    },
    info: {
      main: '#BDA0BC',
    },
    success: {
      main: '#7A8450',
    },
  },
  typography: {
    fontFamily: 'Nunito Variable',
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': 'Nunito Variable',
      },
    },
  },


}
const theme = createTheme(themeOption);


const root = ReactDOM.createRoot(document.getElementById('react-root'));
root.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <CssBaseline />
      <App />
    </Provider>
  </ThemeProvider>
);
