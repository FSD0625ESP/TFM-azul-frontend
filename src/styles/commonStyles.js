// Estilos para inputs de formulario
export const textFieldSx = {
  marginBottom: "16px",
  "& .MuiOutlinedInput-root": {
    height: "48px",
    backgroundColor: "white",
    borderRadius: "9999px",
    "& fieldset": { borderColor: "transparent" },
    "&:hover fieldset": { borderColor: "transparent" },
    "&.Mui-focused fieldset": { borderColor: "transparent" },
  },
  "& .MuiInputBase-input": { color: "black" },
};

// Estilos para botones (Material-UI)
export const buttonSx = {
  height: "48px",
  borderRadius: "9999px",
  backgroundColor: "#123B7E",
  color: "white",
  fontSize: "16px",
  fontWeight: "500",
  textTransform: "none",
  border: "none",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": { backgroundColor: "#0d2a5c" },
  "&:disabled": { opacity: 0.7, cursor: "not-allowed" },
};

// Estilos para botones (inline)
export const buttonStyleInline = {
  height: "48px",
  borderRadius: "9999px",
  backgroundColor: "#123B7E",
  color: "white",
  fontSize: "16px",
  fontWeight: "600",
  border: "none",
  cursor: "pointer",
  width: "100%",
  transition: "all 0.3s ease",
};
