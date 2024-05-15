// App.jsx

import React, { useState, useEffect } from "react";
import { ColorModeContext, useMode } from "./theme.js";
import { CssBaseline, ThemeProvider } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./LoginTasnia/Login.jsx";
import SignupBody from "./SignupBody/SignupBody.jsx";
import Topbar from "./scenes/global/Topbar.jsx";
import Sidebar from "./scenes/global/Sidebar.jsx";
import Dashboard from "./scenes/dashboard";
import Leaderboard from "./scenes/leaderboard/index.jsx";
import UpcomingContests from "./scenes/upcomingcontests/index.jsx";
import About from "./scenes/about/index.jsx";
import AddContest from "./scenes/addcontest/index.jsx";
import { tokens } from "./theme";
import Teams from "./scenes/teams/index.jsx";
import GuestTopbar from "./scenes/global/GuestTopbar.jsx";
import { useNavigate } from "react-router-dom";

function App() {
  const [theme, colorMode] = useMode();
  const colors = tokens(theme.palette.mode);

  // State variable to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    console.log("isAuthenticated changed:", isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    console.log("isAdmin changed:", isAdmin);
  }, [isAdmin]);

  useEffect(() => {
    console.log("Username is: ", username);
  }, [username]);

  // Function to handle user authentication
  const handleLogin = (newUsername) => {
    // Perform authentication logic here
    // If authentication is successful, set isAuthenticated to true
    setIsAuthenticated(true);
    setUsername(newUsername);
    console.log(isAuthenticated);
  };

  const handleAdmin = () => {
    setIsAdmin(true);
    console.log(isAdmin);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUsername("Guest");
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline style={{ backgroundColor: colors.primary[400] }} />
        <div className="app">
          {isAuthenticated && <Sidebar username={username} isAdmin={isAdmin} />}
          {/* <Sidebar username={username} isAdmin={isAdmin} /> */}
          <main className="content">
            {isAuthenticated && <Topbar handleLogout = {handleLogout}/>}
            {!isAuthenticated && <GuestTopbar />}

            <Routes>
              <Route
                path="/login"
                element={
                  <Login handleLogin={handleLogin} handleAdmin={handleAdmin} />
                }
              />
              <Route path="/signup" element={<SignupBody />} />
              <Route
                path="/dashboard"
                element={
                  isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/leaderboard"
                element={
                  isAuthenticated ? <Leaderboard /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/teams"
                element={isAuthenticated ? <Teams isAdmin={isAdmin} /> : <Navigate to="/login" />}
              />
              <Route
                path="/upcomingcontests"
                element={
                  isAuthenticated ? (
                    <UpcomingContests />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/about"
                element={isAuthenticated ? <About /> : <Navigate to="/login" />}
              />
              <Route
                path="/addcontest"
                element={
                  isAuthenticated ? <AddContest /> : <Navigate to="/login" />
                }
              />
              {/* Redirect all other routes to login */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
