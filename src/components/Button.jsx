import React from "react";
import { CircularProgress } from "@mui/material";
import {
  buttonStyleInline,
  buttonHoverHandler,
  COLORS,
} from "../styles/commonStyles";

/**
 * Componente Button reutilizable
 * Reemplaza la duplicación de estilos de botones en toda la app
 */
const Button = ({
  onClick,
  disabled = false,
  loading = false,
  children,
  variant = "primary",
  fullWidth = true,
  style = {},
  className = "",
  ...props
}) => {
  const variantStyles = {
    primary: {
      ...buttonStyleInline,
      width: fullWidth ? "100%" : "auto",
    },
    danger: {
      padding: "4px 12px",
      backgroundColor: COLORS.error,
      color: COLORS.white,
      borderRadius: "6px",
      border: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      fontSize: "12px",
      fontWeight: "600",
      marginLeft: "8px",
      flexShrink: 0,
      opacity: disabled ? 0.7 : 1,
      transition: "opacity 0.3s ease",
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...variantStyles[variant],
        ...style,
      }}
      onMouseEnter={buttonHoverHandler}
      onMouseLeave={buttonHoverHandler}
      className={className}
      {...props}
    >
      {loading ? <CircularProgress size={20} color="inherit" /> : children}
    </button>
  );
};

export default Button;
