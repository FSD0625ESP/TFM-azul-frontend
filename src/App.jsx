import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginNew from "./pages/LoginNew";
import RegisterNew from "./pages/RegisterNew";
import Profile from "./pages/Profile";
import RiderProfile from "./pages/RiderProfile";
import StoreProfile from "./pages/StoreProfile";
import MainScreen from "./pages/MainScreen";
import LotsPage from "./pages/LotsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterNew />} />
        <Route path="/login" element={<LoginNew />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/rider-profile" element={<RiderProfile />} />
        <Route path="/store-profile" element={<StoreProfile />} />
        <Route path="/mainscreen" element={<MainScreen />} />
        <Route path="/lots" element={<LotsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
