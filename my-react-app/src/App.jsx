import { ColorModeContext, useMode } from "./theme.js";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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
// import Leaderboard from "./scenes/teams";
// import UpcomingContests from "./scenes/upcomingcontests";
// import Teams from "./scenes/teams";

// function App() {
//   const [theme, colorMode] = useMode();
//   return (
//     <Router>
//           <Routes>
//             {/* <Route path="/" element={<Login/>} />
//                 <Route path="/" element={<SignupBody/>} /> */}
//             <Route path="/" element={<SignupBody />} />
//             <Route path="/login" element={<Login />} />
//           </Routes>
//     </Router>
//   );
// }

function App() {
  const [theme, colorMode] = useMode();
  const colors = tokens(theme.palette.mode);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline style={{ backgroundColor: colors.primary[400] }} />
        <div className="app">
          <Sidebar />
          <main className="content">
            <Topbar />

            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/upcomingcontests" element={<UpcomingContests />} />
              <Route path="/about" element={<About />} />
              <Route path="/addcontest" element={<AddContest />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<SignupBody />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
