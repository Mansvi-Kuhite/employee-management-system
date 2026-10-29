import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#f2a7c3",
      light: "#f9d3e1",
      dark: "#e58aae",
      contrastText: "#2d1f3d",
    },
    secondary: { main: "#a7c7e7", contrastText: "#2d1f3d" },
    text: { primary: "#2d1f3d" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#f7fbff",
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#a7c7e7" },
        },
        notchedOutline: { borderColor: "#cfe2f5" },
      },
    },
  },
});

export default theme;