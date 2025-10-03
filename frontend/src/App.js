import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import './App.css';
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";
import Auth from "./pages/Auth";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login2" element={<LoginForm />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
