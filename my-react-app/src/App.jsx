import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignupPage from './SignUpPage/SignupPage.jsx';
import LoginPage from './LoginPage/LoginPage.jsx';
import Login from './LoginTasnia/Login.jsx';

function App() {

  return (
    <Router>
            <Routes>
                <Route path="/" element={<Login/>} />
                {/* <Route path="/" element={<SignupPage/>} />
                <Route path="/login" element={<Login/>} /> */}
            </Routes>
        </Router>
  );
}

export default App
