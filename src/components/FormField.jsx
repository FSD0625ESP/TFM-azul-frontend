import React from "react";
import { TextField, InputAdornment } from "@mui/material";

const FormField = ({
  name,
  type = "text",
  placeholder,
  icon,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
}) => {
  const textFieldSx = {
    marginBottom: "16px",
    "& .MuiOutlinedInput-root": {
      height: "48px",
      backgroundColor: "white",
      borderRadius: "9999px",
      "& fieldset": {
        borderColor: "transparent",
      },
      "&:hover fieldset": {
        borderColor: "transparent",
      },
      "&.Mui-focused fieldset": {
        borderColor: "transparent",
      },
    },
    "& .MuiInputBase-input": {
      color: "black",
    },
  };

  return (
    <TextField
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      variant="outlined"
      fullWidth
      sx={textFieldSx}
      error={!!error}
      helperText={helperText}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">{icon}</InputAdornment>
        ),
      }}
      disabled={disabled}
      required
    />
  );
};

export default FormField;
