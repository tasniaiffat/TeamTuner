import React from "react";
import MenuHeader from "../../components/MenuHeader";
import {
  Box,
  useTheme,
  Typography,
  Avatar,
  Button,
  Tooltip,
  Modal,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from "@mui/material";
import { tokens } from "../../theme";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dataCodeforces = {
    labels: ["Solved", "Unsolved"],
    datasets: [
      {
        label: "Codeforces Statistics",
        data: [65, 35], // Example data: 65% solved, 35% unsolved
        backgroundColor: [colors.greenAccent[600], colors.redAccent[600]],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 1,
      },
    ],
  };

  const dataCodechef = {
    labels: ["Solved", "Unsolved"],
    datasets: [
      {
        label: "Codechef Statistics",
        data: [50, 50], // Example data
        backgroundColor: ["#2196f3", "#ff9800"],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 1,
      },
    ],
  };

  const dataAtcoder = {
    labels: ["Solved", "Unsolved"],
    datasets: [
      {
        label: "Atcoder Statistics",
        data: [75, 25], // Example data
        backgroundColor: ["#9c27b0", "#3f51b5"],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box
      m="20px"
      sx={{
        overflowY: "auto",
        maxHeight: "85vh",
        backgroundColor: colors.primary,
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <MenuHeader title="DASHBOARD" />
      </Box>

      {/* Profile Section */}
      <Box display="flex" alignItems="center">
        {/* Profile Picture */}
        {/* <Avatar
          sx={{ width: 130, height: 130, marginLeft: 15, marginRight: 15 }} // Adjust size as needed
          src="../assets/TeamTuner.png" // Add path to profile image
          alt="Profile Picture" */}

        {/* Information Section */}
        <Box>
          <Typography variant="h3" color={colors.blueAccent[400]}>
            John Doe
          </Typography>
          <Typography variant="h6">Institution: University of Dhaka</Typography>
          <Typography variant="h6">Batch: 27</Typography>
          <Typography variant="h6">
            Department: Computer Science and Engineering
          </Typography>
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" mt={4} mb={10}
      >
        {/* Codeforces Statistics */}
        <Box flex={1} p={1} width={250} height={250}>
          <Typography
            ml="110px"
            variant="h5"
            color={colors.blueAccent[400]}
            gutterBottom
          >
            Codeforces Statistics
          </Typography>
          <Bar data={dataCodeforces} />
        </Box>

        {/* Codechef Statistics */}
        <Box flex={1} p={1} width={250} height={250}>
          <Typography
            ml="115px"
            variant="h5"
            color={colors.blueAccent[400]}
            gutterBottom
          >
            Codechef Statistics
          </Typography>
          <Bar data={dataCodechef} />
        </Box>

        
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {/* Atcoder Statistics */}
        <Box flex={1} p={1} width={250} height={250}>
          <Typography
            ml="115px"
            variant="h5"
            color={colors.blueAccent[400]}
            gutterBottom
          >
            Atcoder Statistics
          </Typography>
          <Bar data={dataAtcoder} />
        </Box>

        {/* Vjudge Statistics */}
        <Box flex={1} p={1} width={250} height={250}>
          <Typography
            ml="115px"
            variant="h5"
            color={colors.blueAccent[400]}
            gutterBottom
          >
            Atcoder Statistics
          </Typography>
          <Bar data={dataAtcoder} />
        </Box>
      </Box>

    </Box>
  );
};

export default Dashboard;
