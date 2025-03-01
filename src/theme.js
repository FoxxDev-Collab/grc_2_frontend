import { createTheme } from '@mui/material/styles';

// Base theme configuration shared between light and dark modes
const baseThemeOptions = {
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.3,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 500,
      fontSize: '0.875rem',
      textTransform: 'none',
      lineHeight: 1.75,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      lineHeight: 1.5,
    },
  },
  
  shape: {
    borderRadius: 8,
  },
};

// Light theme palette
const lightPalette = {
  primary: {
    main: '#4361ee',
    light: '#4895ef',
    dark: '#3f37c9',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#7209b7',
    light: '#9d4edd',
    dark: '#560bad',
    contrastText: '#ffffff',
  },
  error: {
    main: '#ef476f',
    light: '#f57c96',
    dark: '#d81b60',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#ffd166',
    light: '#ffe08f',
    dark: '#ffb703',
    contrastText: '#333333',
  },
  info: {
    main: '#4cc9f0',
    light: '#75e6ff',
    dark: '#0096c7',
    contrastText: '#ffffff',
  },
  success: {
    main: '#06d6a0',
    light: '#39e5b6',
    dark: '#069e75',
    contrastText: '#ffffff',
  },
  background: {
    default: '#f8f9fa',
    paper: '#ffffff',
  },
  text: {
    primary: '#333333',
    secondary: '#565656',
    disabled: '#9e9e9e',
  },
  divider: 'rgba(0, 0, 0, 0.08)',
};

// Dark theme palette
const darkPalette = {
  primary: {
    main: '#4895ef',
    light: '#75e6ff',
    dark: '#3f37c9',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#9d4edd',
    light: '#c77dff',
    dark: '#7209b7',
    contrastText: '#ffffff',
  },
  error: {
    main: '#f57c96',
    light: '#ff9eb7',
    dark: '#d81b60',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#ffb703',
    light: '#ffd166',
    dark: '#fb8500',
    contrastText: '#333333',
  },
  info: {
    main: '#75e6ff',
    light: '#a5f3ff',
    dark: '#0096c7',
    contrastText: '#ffffff',
  },
  success: {
    main: '#39e5b6',
    light: '#70ffce',
    dark: '#06d6a0',
    contrastText: '#ffffff',
  },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
  text: {
    primary: '#ffffff',
    secondary: '#b0b0b0',
    disabled: '#6c6c6c',
  },
  divider: 'rgba(255, 255, 255, 0.12)',
};

// Component overrides for light theme
const getLightComponentOverrides = () => ({
  MuiCssBaseline: {
    styleOverrides: {
      '*': {
        boxSizing: 'border-box',
      },
      html: {
        MozOsxFontSmoothing: 'grayscale',
        WebkitFontSmoothing: 'antialiased',
        height: '100%',
        width: '100%',
      },
      body: {
        height: '100%',
      },
      '#root': {
        height: '100%',
      },
      '::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '::-webkit-scrollbar-track': {
        background: '#f1f1f1',
      },
      '::-webkit-scrollbar-thumb': {
        background: '#c1c1c1',
        borderRadius: '4px',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: '#a8a8a8',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: 8,
        fontWeight: 500,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        },
      },
      contained: {
        '&:hover': {
          transform: 'translateY(-1px)',
        },
      },
      containedPrimary: {
        background: 'linear-gradient(45deg, #4361ee 30%, #4895ef 90%)',
      },
      containedSecondary: {
        background: 'linear-gradient(45deg, #7209b7 30%, #9d4edd 90%)',
      },
      outlined: {
        borderWidth: '1.5px',
        '&:hover': {
          borderWidth: '1.5px',
        },
      },
      sizeSmall: {
        padding: '4px 12px',
      },
      sizeMedium: {
        padding: '6px 16px',
      },
      sizeLarge: {
        padding: '8px 22px',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: '24px',
        '&:last-child': {
          paddingBottom: '24px',
        },
      },
    },
  },
  MuiCardHeader: {
    styleOverrides: {
      root: {
        padding: '20px 24px',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        fontWeight: 500,
      },
      colorPrimary: {
        backgroundColor: 'rgba(67, 97, 238, 0.1)',
        color: '#4361ee',
      },
      colorSecondary: {
        backgroundColor: 'rgba(114, 9, 183, 0.1)',
        color: '#7209b7',
      },
      colorSuccess: {
        backgroundColor: 'rgba(6, 214, 160, 0.1)',
        color: '#06d6a0',
      },
      colorError: {
        backgroundColor: 'rgba(239, 71, 111, 0.1)',
        color: '#ef476f',
      },
      colorWarning: {
        backgroundColor: 'rgba(255, 209, 102, 0.1)',
        color: '#ffc300',
      },
      colorInfo: {
        backgroundColor: 'rgba(76, 201, 240, 0.1)',
        color: '#4cc9f0',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
      },
      outlined: {
        borderColor: 'rgba(0, 0, 0, 0.08)',
      },
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        backgroundColor: '#f6f8fd',
        '& .MuiTableCell-root': {
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#565656',
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
        padding: '16px',
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          '& fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.12)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.24)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#4361ee',
            borderWidth: 1,
          },
        },
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: 'none',
        boxShadow: '0px 0px 25px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        height: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
      },
      bar: {
        borderRadius: 10,
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: 'rgba(0, 0, 0, 0.08)',
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        backgroundColor: '#4361ee',
        color: '#ffffff',
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '0.875rem',
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
      },
    },
  },
  MuiAccordion: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
        '&:before': {
          display: 'none',
        },
      },
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: {
        padding: '0 16px',
        borderRadius: 8,
        '&.Mui-expanded': {
          minHeight: 48,
        },
      },
      content: {
        '&.Mui-expanded': {
          margin: '12px 0',
        },
      },
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: {
        padding: '0 16px 16px',
      },
    },
  },
});

// Component overrides for dark theme
const getDarkComponentOverrides = () => ({
  MuiCssBaseline: {
    styleOverrides: {
      '*': {
        boxSizing: 'border-box',
      },
      html: {
        MozOsxFontSmoothing: 'grayscale',
        WebkitFontSmoothing: 'antialiased',
        height: '100%',
        width: '100%',
      },
      body: {
        height: '100%',
      },
      '#root': {
        height: '100%',
      },
      '::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '::-webkit-scrollbar-track': {
        background: '#2c2c2c',
      },
      '::-webkit-scrollbar-thumb': {
        background: '#6c6c6c',
        borderRadius: '4px',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: '#8c8c8c',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: 8,
        fontWeight: 500,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
        },
      },
      contained: {
        '&:hover': {
          transform: 'translateY(-1px)',
        },
      },
      containedPrimary: {
        background: 'linear-gradient(45deg, #3f37c9 30%, #4895ef 90%)',
      },
      containedSecondary: {
        background: 'linear-gradient(45deg, #7209b7 30%, #c77dff 90%)',
      },
      outlined: {
        borderWidth: '1.5px',
        '&:hover': {
          borderWidth: '1.5px',
        },
      },
      sizeSmall: {
        padding: '4px 12px',
      },
      sizeMedium: {
        padding: '6px 16px',
      },
      sizeLarge: {
        padding: '8px 22px',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.3)',
        },
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: '24px',
        '&:last-child': {
          paddingBottom: '24px',
        },
      },
    },
  },
  MuiCardHeader: {
    styleOverrides: {
      root: {
        padding: '20px 24px',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        fontWeight: 500,
      },
      colorPrimary: {
        backgroundColor: 'rgba(72, 149, 239, 0.2)',
        color: '#75e6ff',
      },
      colorSecondary: {
        backgroundColor: 'rgba(157, 78, 221, 0.2)',
        color: '#c77dff',
      },
      colorSuccess: {
        backgroundColor: 'rgba(57, 229, 182, 0.2)',
        color: '#70ffce',
      },
      colorError: {
        backgroundColor: 'rgba(245, 124, 150, 0.2)',
        color: '#ff9eb7',
      },
      colorWarning: {
        backgroundColor: 'rgba(255, 183, 3, 0.2)',
        color: '#ffd166',
      },
      colorInfo: {
        backgroundColor: 'rgba(117, 230, 255, 0.2)',
        color: '#a5f3ff',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
      },
      outlined: {
        borderColor: 'rgba(255, 255, 255, 0.12)',
      },
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        backgroundColor: '#2c2c2c',
        '& .MuiTableCell-root': {
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#b0b0b0',
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '16px',
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.23)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.4)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#4895ef',
            borderWidth: 1,
          },
        },
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: 'none',
        boxShadow: '0px 0px 25px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
      bar: {
        borderRadius: 10,
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: 'rgba(255, 255, 255, 0.12)',
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        backgroundColor: '#4895ef',
        color: '#ffffff',
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '0.875rem',
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
      },
    },
  },
  MuiAccordion: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
        '&:before': {
          display: 'none',
        },
      },
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: {
        padding: '0 16px',
        borderRadius: 8,
        '&.Mui-expanded': {
          minHeight: 48,
        },
      },
      content: {
        '&.Mui-expanded': {
          margin: '12px 0',
        },
      },
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: {
        padding: '0 16px 16px',
      },
    },
  },
});

// Create light theme with shadows
export const createLightTheme = () => {
  const lightTheme = createTheme({
    ...baseThemeOptions,
    palette: {
      mode: 'light',
      ...lightPalette,
    },
    components: getLightComponentOverrides(),
  });

  // Add all 25 shadow levels
  lightTheme.shadows = [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
    '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
    '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
    '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
    '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
    '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
    '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
    '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
    '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
    '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
    '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
    '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
    '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
    '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
    '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
    '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
    '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
  ];

  return lightTheme;
};

// Create dark theme with shadows
export const createDarkTheme = () => {
  const darkTheme = createTheme({
    ...baseThemeOptions,
    palette: {
      mode: 'dark',
      ...darkPalette,
    },
    components: getDarkComponentOverrides(),
  });

  // Add all 25 shadow levels with darker shadows for dark theme
  darkTheme.shadows = [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.3),0px 1px 1px 0px rgba(0,0,0,0.24),0px 1px 3px 0px rgba(0,0,0,0.22)',
    '0px 3px 1px -2px rgba(0,0,0,0.3),0px 2px 2px 0px rgba(0,0,0,0.24),0px 1px 5px 0px rgba(0,0,0,0.22)',
    '0px 3px 3px -2px rgba(0,0,0,0.3),0px 3px 4px 0px rgba(0,0,0,0.24),0px 1px 8px 0px rgba(0,0,0,0.22)',
    '0px 2px 4px -1px rgba(0,0,0,0.3),0px 4px 5px 0px rgba(0,0,0,0.24),0px 1px 10px 0px rgba(0,0,0,0.22)',
    '0px 3px 5px -1px rgba(0,0,0,0.3),0px 5px 8px 0px rgba(0,0,0,0.24),0px 1px 14px 0px rgba(0,0,0,0.22)',
    '0px 3px 5px -1px rgba(0,0,0,0.3),0px 6px 10px 0px rgba(0,0,0,0.24),0px 1px 18px 0px rgba(0,0,0,0.22)',
    '0px 4px 5px -2px rgba(0,0,0,0.3),0px 7px 10px 1px rgba(0,0,0,0.24),0px 2px 16px 1px rgba(0,0,0,0.22)',
    '0px 5px 5px -3px rgba(0,0,0,0.3),0px 8px 10px 1px rgba(0,0,0,0.24),0px 3px 14px 2px rgba(0,0,0,0.22)',
    '0px 5px 6px -3px rgba(0,0,0,0.3),0px 9px 12px 1px rgba(0,0,0,0.24),0px 3px 16px 2px rgba(0,0,0,0.22)',
    '0px 6px 6px -3px rgba(0,0,0,0.3),0px 10px 14px 1px rgba(0,0,0,0.24),0px 4px 18px 3px rgba(0,0,0,0.22)',
    '0px 6px 7px -4px rgba(0,0,0,0.3),0px 11px 15px 1px rgba(0,0,0,0.24),0px 4px 20px 3px rgba(0,0,0,0.22)',
    '0px 7px 8px -4px rgba(0,0,0,0.3),0px 12px 17px 2px rgba(0,0,0,0.24),0px 5px 22px 4px rgba(0,0,0,0.22)',
    '0px 7px 8px -4px rgba(0,0,0,0.3),0px 13px 19px 2px rgba(0,0,0,0.24),0px 5px 24px 4px rgba(0,0,0,0.22)',
    '0px 7px 9px -4px rgba(0,0,0,0.3),0px 14px 21px 2px rgba(0,0,0,0.24),0px 5px 26px 4px rgba(0,0,0,0.22)',
    '0px 8px 9px -5px rgba(0,0,0,0.3),0px 15px 22px 2px rgba(0,0,0,0.24),0px 6px 28px 5px rgba(0,0,0,0.22)',
    '0px 8px 10px -5px rgba(0,0,0,0.3),0px 16px 24px 2px rgba(0,0,0,0.24),0px 6px 30px 5px rgba(0,0,0,0.22)',
    '0px 8px 11px -5px rgba(0,0,0,0.3),0px 17px 26px 2px rgba(0,0,0,0.24),0px 6px 32px 5px rgba(0,0,0,0.22)',
    '0px 9px 11px -5px rgba(0,0,0,0.3),0px 18px 28px 2px rgba(0,0,0,0.24),0px 7px 34px 6px rgba(0,0,0,0.22)',
    '0px 9px 12px -6px rgba(0,0,0,0.3),0px 19px 29px 2px rgba(0,0,0,0.24),0px 7px 36px 6px rgba(0,0,0,0.22)',
    '0px 10px 13px -6px rgba(0,0,0,0.3),0px 20px 31px 3px rgba(0,0,0,0.24),0px 8px 38px 7px rgba(0,0,0,0.22)',
    '0px 10px 13px -6px rgba(0,0,0,0.3),0px 21px 33px 3px rgba(0,0,0,0.24),0px 8px 40px 7px rgba(0,0,0,0.22)',
    '0px 10px 14px -6px rgba(0,0,0,0.3),0px 22px 35px 3px rgba(0,0,0,0.24),0px 8px 42px 7px rgba(0,0,0,0.22)',
    '0px 11px 14px -7px rgba(0,0,0,0.3),0px 23px 36px 3px rgba(0,0,0,0.24),0px 9px 44px 8px rgba(0,0,0,0.22)',
    '0px 11px 15px -7px rgba(0,0,0,0.3),0px 24px 38px 3px rgba(0,0,0,0.24),0px 9px 46px 8px rgba(0,0,0,0.22)',
  ];

  return darkTheme;
};

// For backward compatibility
export const theme = createLightTheme();