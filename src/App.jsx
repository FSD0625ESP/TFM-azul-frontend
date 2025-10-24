import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SelectUserType from "./pages/SelectUserType";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ShopDetails from "./pages/ShopDetails";
import Profile from "./pages/Profile";
import MainScreen from "./pages/MainScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/select-user-type" element={<SelectUserType />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shop-details" element={<ShopDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mainscreen" element={<MainScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
