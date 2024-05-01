import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignupPage from './SignupPage.jsx';
import LoginPage from './LoginPage.jsx';

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
