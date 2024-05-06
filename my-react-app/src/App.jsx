import { ColorModeContext, useMode } from "./theme.js";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./LoginTasnia/Login.jsx";
import SignupBody from "./SignupBody/SignupBody.jsx";
import Topbar from "./scenes/global/Topbar.jsx";

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
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <main className="content">
            <Topbar />
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
