import {createTheme, ThemeProvider } from '@mui/material/styles';

const newTheme = () => {
  const theme = createTheme({
    status: {
      danger: '#e53e3e',
    },
    palette: {
      primary: {
        main: '#FFA000',
        darker: '#FFA000',
        contrastText: '#000000',
      },
      secondary: {
        main: '#000000',
        darker: '#000000',
        contrastText: '#FFFFFF',
      },
      secondary_white: {
        main: '#FFFFFF',
        darker: '#AFAFAF',
        contrastText: '#000000',
      },
      neutral: {
        main: '#FFF6E7',
        contrastText: '#FFA000',
      },
    },
   typography: {
    fontFamily: [
      '-apple-system',
      'Roboto',
      'Times New Roman',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'BlinkMacSystemFont',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
     body1_bold: {
      fontFamily: ['Roboto', 'Arial'].join(','),
      fontSize: 16,
      fontWeight: 800 // or 'bold'
     },
     b1: {
      fontFamily: ['Arial'].join(','),
      fontSize: 16,
      fontWeight: 600 // or 'bold'
     },
     body2_bold: {
      fontFamily: ['Roboto', 'Arial'].join(','),
      fontSize: 14,
      fontWeight: 600 // or 'bold'
     },
     h4:{
      fontFamily: ['Times New Roman', 'Arial'].join(','),
     },
     h5:{
      fontFamily: ['Roboto', 'Arial'].join(','),
      fontSize: 20,
      letterSpacing: '2px',
     },
     h6:{
      fontFamily: ['Roboto', 'Arial'].join(','),
      fontWeight: 600,
     },
     button:{
      fontFamily: ['Roboto', 'Arial'].join(','),
      fontWeight: 600,
      fontSize: 16,
      letterSpacing: '2px',
     },
     button_max:{
      fontFamily: ['Roboto', 'Arial'].join(','),
      fontWeight: 600,
      fontSize: 18,
      letterSpacing: '2px',
     },
     button_min:{
      fontFamily: ['Roboto', 'Arial'].join(','),
      fontWeight: 600,
      fontSize: 14,
      letterSpacing: '2px',
     }
   }
  });

  return theme;
}

export default newTheme;
