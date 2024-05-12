import React, { useState } from 'react';
import MenuHeader from '../../components/MenuHeader';
import {
  Box, useTheme, Card, CardContent, Typography, Button, Tooltip, Modal, List, ListItem, ListItemText, Checkbox, TextField, Alert
} from '@mui/material';
import { tokens } from "../../theme";

const Teams = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [people, setPeople] = useState(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']);

  // Mock data for teams
  const generatedTeams = [
    { teamName: 'CSEDU Alpha', members: ['Ami', 'Bhat', 'Khabo'] },
    { teamName: 'CSEDU Beta', members: ['Gulu', 'Gulu', 'Bulu'] },
    { teamName: 'CSEDU Gamma', members: ['Boop', 'Moop', 'Loop'] }
  ];

  const [createdTeams, setCreatedTeams] = useState([]);

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
  const handleCreateTeam = () => {
    if (selectedMembers.length !== 3) {
      setAlertMessage('Please select exactly three members!');
      return;
    }
    
    // Create a new team name dynamically
    const newTeamName = `Custom Team ${createdTeams.length + 1}`;

    // Add the new team
    const newTeam = { teamName: newTeamName, members: selectedMembers };
    setCreatedTeams([...createdTeams, newTeam]);

    // Remove selected members from the available people list
    const remainingPeople = people.filter((person) => !selectedMembers.includes(person));
    setPeople(remainingPeople);

    // Reset selection and close modal
    setSelectedMembers([]);
    setAlertMessage('');
    setModalOpen(false);
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
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: colors.blueAccent[500],
          boxShadow: 24,
          p: 4,
          borderRadius: '8px',
          width: '700px',
          maxHeight: '400px',
          overflowY: 'auto'
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
    <Box m="20px" sx={{ overflowY: 'auto', backgroundColor: colors.primary, maxHeight: '80vh'}}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <MenuHeader title="Teams" subtitle="Top Teams of CSEDU!" />
        <Tooltip title="Create Team">
  <Button 
    onClick={() => setModalOpen(true)} 
    variant="contained" 
    color="primary" 
    sx={{ marginRight: '10px' }}
  >
    Create Team
  </Button>
</Tooltip>

      </Box>

      {/* Created Teams Cards (Announced Teams) */}
      {createdTeams.length > 0 && (
        <>
          <Typography variant="h3" gutterBottom mt={4} mb={2}>
            Announced Teams
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
            {createdTeams.map((team, index) => (
              <Card key={index} sx={{ width: 250, borderRadius: 4, backgroundColor: colors.primary[400] }}>
                <CardContent>
                  <Typography gutterBottom variant="h4" component="div" color={colors.blueAccent[400]}>
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
          </Box>
        </>
      )}

      {/* Initial Teams Cards (Teams by TeamTuner) */}
      <Typography variant="h3" gutterBottom mt={4} mb={2}>
        Teams by TeamTuner
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
        {generatedTeams.map((team, index) => (
          <Card key={index} sx={{ width: 250, borderRadius: 4, backgroundColor: colors.primary[400] }}>
            <CardContent>
              <Typography gutterBottom variant="h4" component="div" color={colors.blueAccent[400]}>
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
      </Box>

      {teamModal} {/* Render the modal for creating teams */}
    </Box>
  );
}

export default Teams;
