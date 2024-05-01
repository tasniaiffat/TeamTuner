import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignupPage from './SignUpPage/SignupPage.jsx';
import LoginPage from './LoginPage/LoginPage.jsx';

function App() {

  return (
    <Router>
            <Routes>
                <Route path="/" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </Router>
  );
}

export default App
