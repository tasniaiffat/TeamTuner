import React, { useState, useEffect } from "react";
import MenuHeader from "../../components/MenuHeader";
import {
  Box,
  useTheme,
  Card,
  CardContent,
  Typography,
  Button,
  Tooltip,
  Modal,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  TextField,
  Alert,
} from "@mui/material";
import { tokens } from "../../theme";
import { Person } from "@mui/icons-material";

const Teams = ({ isAdmin }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [people, setPeople] = useState([])
  
   useEffect(() => {
    async function fetchAvailablePeople() {
      try {
        const response = await fetch('http://127.0.0.1:8000/contest/findMembers');
        if (!response.ok) {
          throw new Error('Failed to fetch teams data');
        }
        const data = await response.json();
        const members = data.remaining_members || []
        setPeople(members);
      } catch (error) {
        console.error('Error fetching people data:', error);
      }
    }
    fetchAvailablePeople();
  }, []);

  // Mock data for teams

  const [generatedTeams, setTeams] = useState([])

  useEffect(() => {
    async function fetchTeamsData() {
      try {
        const response = await fetch('http://127.0.0.1:8000/contest/generateTeams');
        if (!response.ok) {
          throw new Error('Failed to fetch teams data');
        }
        const data = await response.json();
        const teams = data.teams.map(team => {
          const [teamName] = Object.keys(team);
          return { teamName: `${teamName}`, members: team[teamName] }; // Add return here
        });
        setTeams(teams);
      } catch (error) {
        console.error('Error fetching teams data:', error);
      }
    }
    fetchTeamsData();
  }, []);
  

  

  const [createdTeams, setCreatedTeams] = useState([]);

  useEffect(() => {
    async function fetchCreatedTeams() {
      try {
        const response = await fetch('http://127.0.0.1:8000/contest/CreatedTeams');
        if (!response.ok) {
          throw new Error('Failed to fetch teams data');
        }
        const data = await response.json();

        const teams = data.teams.map(team => {
        const teamName = team.name ? `${team.name}` : "Unnamed Team";
        const member = [];

        for (const key in team) {
          if (key.toLowerCase().includes("member")) {
            member.push(team[key]);
          }
        }
          return { teamName: `${teamName}`, members: member }; 
        });
        setCreatedTeams(teams);
      } catch (error) {
        console.error('Error fetching teams data:', error);
      }
    }
    fetchCreatedTeams();
  }, []);

  // Toggle function to handle selecting members
  const handleToggle = (value) => {
    const currentIndex = selectedMembers.indexOf(value);
    const newChecked = [...selectedMembers];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedMembers(newChecked);
  };

  // Filter the list of people based on the search query and not already chosen in created teams
  const filteredPeople = people.filter((person) =>
    person.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to add a new team if three members are selected
  const handleCreateTeam = async () => {
    if (selectedMembers.length !== 3) {
      setAlertMessage("Please select exactly three members!");
      return;
    }
  
    
    const newTeamName = `Custom Team ${createdTeams.length + 1}`;
  
    // Add the new team
    const newTeam = { teamName: newTeamName, members: selectedMembers };
    console.log(newTeam);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/contest/addTeam", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          member1: newTeam.members[0],
          member2: newTeam.members[1],
          member3: newTeam.members[2],
          name: newTeam.teamName,  // Use newTeam.teamName instead of teamName
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update backend");
      }
  
      setCreatedTeams([...createdTeams, newTeam]);
  
      // Remove selected members from the available people list
      const remainingPeople = people.filter(
        (person) => !selectedMembers.includes(person)
      );
      setPeople(remainingPeople);
  
      // Reset selection and close modal
      setSelectedMembers([]);
      setAlertMessage("");
      setModalOpen(false);
  
    } catch (error) {
      console.error("Error creating team:", error);
      setAlertMessage("Failed to create team. Please try again.");
    }
  };

  const deleteTeamByName = (teamNameToDelete) => {
    setCreatedTeams(prevTeams => prevTeams.filter(team => team.teamName !== teamNameToDelete));
  };

  const handleDeleteTeam = async (teamName, teammembers) => {
    console.log(createdTeams)
    const confirmDelete = window.confirm("Do you want to delete this contest?");
    if (confirmDelete) {
      console.log("Deleting contest:", teamName);
      try {
        const response = await fetch("http://127.0.0.1:8000/contest/deleteTeam", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: teamName  // Use newTeam.teamName instead of teamName
          }),
        });
    
        if (!response.ok) {
          throw new Error("Failed to update backend");
        }
        

        people.push(...teammembers)
        setPeople(people)
        console.log(people)
        deleteTeamByName(teamName)
        
      } catch (error) {
        console.error("Error removing team:", error);
        setAlertMessage("Failed to remove team. Please try again.");
      }
    };
  
  };
  
  // Modal component to choose members
  const teamModal = (
    <Modal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      aria-labelledby="create-team-modal"
      aria-describedby="select-team-members"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: colors.blueAccent[500],
          boxShadow: 24,
          p: 4,
          borderRadius: "8px",
          width: "700px",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        <Typography id="modal-modal-title" variant="h6" gutterBottom>
          Select Team Members
        </Typography>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          margin="dense"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {alertMessage && <Alert severity="warning">{alertMessage}</Alert>}
        <List dense>
          {filteredPeople.map((person) => (
            <ListItem key={person} button onClick={() => handleToggle(person)}>
              <Checkbox
                edge="start"
                checked={selectedMembers.indexOf(person) !== -1}
                tabIndex={-1}
                disableRipple
              />
              <ListItemText primary={person} />
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleCreateTeam}
        >
          Done
        </Button>
      </Box>
    </Modal>
  );

  return (
    <Box
      m="20px"
      sx={{
        overflowY: "auto",
        backgroundColor: colors.primary,
        maxHeight: "80vh",
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <MenuHeader title="Teams" subtitle="Top Teams of CSEDU!" />
        {isAdmin && (<Tooltip title="Create Team">
          <Button
            onClick={() => setModalOpen(true)}
            variant="contained"
            color="primary"
            sx={{ marginRight: "10px" }}
          >
            Create Team
          </Button>
        </Tooltip>)}
      </Box>
      {/* Created Teams Cards (Announced Teams) */}
      {createdTeams.length<=0 && (
        <Typography variant="h3">No Teams Announced Yet</Typography>
      )}
      {createdTeams.length > 0 && (
        <>
          <Typography variant="h3" gutterBottom mt={4} mb={2}>
            Announced Teams
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
          {createdTeams.map((team, index) => (
            <Card
              key={index}
              sx={{
                width: 250,
                borderRadius: 4,
                backgroundColor: colors.primary[400],
              }}
            >
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h4"
                  component="div"
                  color={colors.blueAccent[400]}
                >
                  {team.teamName}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[400]}>
                  Members:
                </Typography>
                {team.members.map((member, idx) => (
                  <Typography key={idx} variant="h6">
                    {member}
                  </Typography>
                ))}
                {/* Delete button */}
                {isAdmin && (<Button
                  onClick={() => handleDeleteTeam(team.teamName, team.members)}
                  variant="contained"
                  color="error"
                  sx={{ mt: 2}}
                >
                  Delete
                </Button>)}
              </CardContent>
            </Card>
          ))}
        </Box>
        </>
      )}
      {/* Initial Teams Cards (Teams by TeamTuner) */}
      {isAdmin && (
      <Typography variant="h3" gutterBottom mt={4} mb={2}>
        Teams by TeamTuner
      </Typography>)}
      {isAdmin && (
      <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
        {generatedTeams.map((team, index) => (
          <Card
            key={index}
            sx={{
              width: 250,
              borderRadius: 4,
              backgroundColor: colors.primary[400],
            }}
          >
            <CardContent>
              <Typography
                gutterBottom
                variant="h4"
                component="div"
                color={colors.blueAccent[400]}
              >
                {team.teamName}
              </Typography>
              <Typography variant="h5" color={colors.greenAccent[400]}>
                Members:
              </Typography>
              {team.members.map((member, idx) => (
                <Typography key={idx} variant="h6">
                  {member}
                </Typography>
              ))}
            </CardContent>
          </Card>
        ))}
      </Box>)}
      {teamModal} {/* Render the modal for creating teams */}
    </Box>
  );
};

export default Teams;
