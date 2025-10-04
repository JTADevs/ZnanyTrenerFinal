import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import './App.css';


function App() {
  return (
    <GoogleOAuthProvider
      clientId="912078474153-rk40t7ge472dpclr1fclanvrgj0a8gd6.apps.googleusercontent.com"
    >
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
