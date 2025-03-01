import { useState, useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CssBaseline from '@mui/material/CssBaseline';
import { createLightTheme, createDarkTheme } from './theme';
import { router } from './routes';
import { ThemeContext } from './context/ThemeContext';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const theme = useMemo(() => {
    return isDarkMode ? createDarkTheme() : createLightTheme();
  }, [isDarkMode]);

  const handleThemeToggle = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const themeContextValue = {
    isDarkMode,
    onThemeToggle: handleThemeToggle
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          <RouterProvider router={router} />
        </LocalizationProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
