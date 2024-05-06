import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './LoginTasnia/Login.jsx';
import SignupBody from './SignupBody/SignupBody.jsx';

function App() {

  return (
    <Router>
            <Routes>
            {/* <Route path="/" element={<Login/>} />
                <Route path="/" element={<SignupBody/>} /> */}
                <Route path="/" element={<SignupBody/>} />
                <Route path="/login" element={<Login/>} />
            </Routes>
        </Router>
  );
}

export default App
