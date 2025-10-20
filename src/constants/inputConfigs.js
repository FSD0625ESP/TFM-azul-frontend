import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";

// Configuración para inputs de Login
export const LOGIN_INPUTS = [
  {
    name: "email",
    type: "email",
    placeholder: "Email",
    icon: <EmailOutlinedIcon style={{ color: "black", fontSize: "20px" }} />,
  },
  {
    name: "password",
    type: "password",
    placeholder: "Password",
    icon: <LockOutlinedIcon style={{ color: "black", fontSize: "20px" }} />,
  },
];

// Configuración para inputs de Register
export const REGISTER_INPUTS = [
  {
    name: "name",
    type: "text",
    placeholder: "Name",
    icon: <PersonOutlinedIcon style={{ color: "black", fontSize: "20px" }} />,
  },
  {
    name: "surnames",
    type: "text",
    placeholder: "Surnames",
    icon: <PersonOutlinedIcon style={{ color: "black", fontSize: "20px" }} />,
  },
  {
    name: "email",
    type: "email",
    placeholder: "Email",
    icon: <EmailOutlinedIcon style={{ color: "black", fontSize: "20px" }} />,
  },
  {
    name: "password",
    type: "password",
    placeholder: "Password",
    icon: <LockOutlinedIcon style={{ color: "black", fontSize: "20px" }} />,
  },
  {
    name: "repeatPassword",
    type: "password",
    placeholder: "Repeat Password",
    icon: <LockOutlinedIcon style={{ color: "black", fontSize: "20px" }} />,
  },
  {
    name: "phoneNumber",
    type: "tel",
    placeholder: "Phone Number",
    icon: <PhoneOutlinedIcon style={{ color: "black", fontSize: "20px" }} />,
  },
];
