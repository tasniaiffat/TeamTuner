import { useState, useEffect } from "react";
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

const Dashboard = ({user}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [dataCodeforces, setDataCodeforces] = useState({
    labels: [],
    datasets: [
      {
        label: "Codeforces Statistics",
        data: [],
        backgroundColor: ['#00ff00', '#ff0000'], // Example colors
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/contest/judgeResult',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add any additional headers if required
          },
          body: JSON.stringify({
            "email" : user["Email"],
            "type" : "Codeforces"})
        });
        const data = await response.json();

        const updatedDataCodeforces = {
          ...dataCodeforces,
          labels: data.title,
          datasets: [
            {
              ...dataCodeforces.datasets[0],
              data: data.solved.map(Number), // Convert solved to numbers
            },
          ],
        };

        setDataCodeforces(updatedDataCodeforces);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const [dataCodechef, setDataCodechef] = useState({
    labels: [],
    datasets: [
      {
        label: "Codechef Statistics",
        data: [],
        backgroundColor: ["#2196f3", "#ff9800"],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/contest/judgeResult',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add any additional headers if required
          },
          body: JSON.stringify({
            "email" : user["Email"],
            "type" : "Codechef"})
        });
        const data = await response.json();

        const updatedDataCodechef = {
          ...dataCodechef,
          labels: data.title,
          datasets: [
            {
              ...dataCodechef.datasets[0],
              data: data.solved.map(Number), // Convert solved to numbers
            },
          ],
        };

        setDataCodechef(updatedDataCodechef);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const [dataAtcoder, setDataAtcoder] = useState({
    labels: [],
    datasets: [
      {
        label: "Atcoder Statistics",
        data: [],
        backgroundColor: ["#9c27b0", "#3f51b5"],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/contest/judgeResult',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add any additional headers if required
          },
          body: JSON.stringify({
            "email" : user["Email"],
            "type" : "Atcoder"})
        });
        const data = await response.json();

        const updatedDataAtcoder = {
          ...dataAtcoder,
          labels: data.title,
          datasets: [
            {
              ...dataAtcoder.datasets[0],
              data: data.solved.map(Number), // Convert solved to numbers
            },
          ],
        };

        setDataAtcoder(updatedDataAtcoder);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const [dataVjudge, setDataVjudge] = useState({
    labels: [],
    datasets: [
      {
        label: "Vjudge Statistics",
        data: [],
        backgroundColor: ["#9c27b0", "#3f51b5"],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/contest/judgeResult',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add any additional headers if required
          },
          body: JSON.stringify({
            "email" : user["Email"],
            "type" : "Vjudge"})
        });
        const data = await response.json();

        const updatedDataVjudge = {
          ...dataVjudge,
          labels: data.title,
          datasets: [
            {
              ...dataVjudge.datasets[0],
              data: data.solved.map(Number), // Convert solved to numbers
            },
          ],
        };

        setDataVjudge(updatedDataVjudge);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
            {user["First Name"]} {user["Last Name"]}
          </Typography>
          <Typography variant="h6">Institution: University of Dhaka</Typography>
          <Typography variant="h6">Session: {user["Session"]}</Typography>
          <Typography variant="h6">
            Department: {user["Department"]}
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
            Vjudge Statistics
          </Typography>
          <Bar data={dataVjudge} />
        </Box>
      </Box>

    </Box>
  );
};

export default Dashboard;







