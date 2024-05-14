import { Box, Typography, useTheme, TextField, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import MenuHeader from "../../components/MenuHeader";
import { fetchLeaderboardData } from "../../data/participantData.js";
import { useState, useEffect } from "react";

const Leaderboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [rowData, setRowData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [atcoderWeight, setAtcoderWeight] = useState("");
  const [codeforcesWeight, setCodeforcesWeight] = useState("");
  const [codechefWeight, setCodechefWeight] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLeaderboardData();
        console.log("Fetched data:", data);
        if (data) {
          setRowData(data);
        } else {
          console.error("Failed to fetch leaderboard data");
        }
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEnter = () => {
    if (
      startDate &&
      endDate &&
      atcoderWeight &&
      codeforcesWeight &&
      codechefWeight
    ) {
      const atcoderWeightFloat = parseFloat(atcoderWeight);
      const codeforcesWeightFloat = parseFloat(codeforcesWeight);
      const codechefWeightFloat = parseFloat(codechefWeight);

      if (
        !isNaN(atcoderWeightFloat) &&
        !isNaN(codeforcesWeightFloat) &&
        !isNaN(codechefWeightFloat)
      ) {
        // Handle the logic for the entered values here
        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);
        console.log("Atcoder Weight:", atcoderWeightFloat);
        console.log("Codeforces Weight:", codeforcesWeightFloat);
        console.log("Codechef Weight:", codechefWeightFloat);
      } else {
        console.error("Weights must be valid numbers");
      }
    } else {
      console.error("All fields must be filled");
    }
  };

  const columns = [
    { field: "id", headerName: "Rank" },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "cf_solve",
      headerName: "Codeforces",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "cc_solve",
      headerName: "Codechef",
      type: "number",
      flex: 1,
    },
    {
      field: "ac_solve",
      headerName: "Atcoder",
      type: "number",
      flex: 1,
    },
    {
      field: "vjudge_solve",
      headerName: "Offline",
      type: "number",
      flex: 1,
    },
    {
      field: "score",
      headerName: "Score",
      type: "float",
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <MenuHeader title="LEADERBOARD" subtitle="This is made using mock data" />
      <Box display="flex" gap="20px" my="20px">
        <TextField
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <TextField
          label="Atcoder Weight"
          type="number"
          value={atcoderWeight}
          onChange={(e) => setAtcoderWeight(e.target.value)}
        />
        <TextField
          label="Codeforces Weight"
          type="number"
          value={codeforcesWeight}
          onChange={(e) => setCodeforcesWeight(e.target.value)}
        />
        <TextField
          label="Codechef Weight"
          type="number"
          value={codechefWeight}
          onChange={(e) => setCodechefWeight(e.target.value)}
        />
        <Button variant="contained" onClick={handleEnter}>
          Enter
        </Button>
      </Box>
      <Box
        m="40px 0 0 0"
        height="65vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={rowData}
          columns={columns}
          slots={{
            toolbar: GridToolbar,
          }}
        />
      </Box>
    </Box>
  );
};

export default Leaderboard;
