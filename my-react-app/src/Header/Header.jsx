import './Header.css'
import Logo from'./Assets/TeamTuner.png'
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

function Header(){
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return(
        <Box>
        <div className='header'>
        <img src={Logo} alt='Logo' className="logo" />
        <h1 id = 'name' color={colors.greenAccent[400]}>TeamTuner</h1>   
        </div></Box>
    )
}

export default Header