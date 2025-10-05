import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";


function App() {
  return (
    <GoogleOAuthProvider clientId="912078474153-rk40t7ge472dpclr1fclanvrgj0a8gd6.apps.googleusercontent.com">
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/profil" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
