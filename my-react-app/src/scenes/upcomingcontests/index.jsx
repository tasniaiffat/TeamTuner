import { useState, useEffect } from "react";
import StarOutlineIcon from '@mui/icons-material/StarOutline';

import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import MenuHeader from "../../components/MenuHeader";
import { tokens } from "../../theme";
import FormDialog from "../../components/Dialog";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const UpcomingContests = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [contestEvents, setContestEvents] = useState([]);
  const [currentEvents, setCurrentEvents] = useState([]);

  useEffect(() => {
    const fetchContestData = async () => {
      try {
        const today = new Date();
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedToday = today.toLocaleDateString('en-US', options);
        const parts = formattedToday.split(' ');
        const formattedDate = `${parts[1]} ${parts[0]}, ${parts[2]}`;
        const formattedDateWithoutComma = formattedDate.replace(',', '');
        console.log(formattedDateWithoutComma); // Output: "16 May 2024"
        const response = await getContestOnDate(formattedDateWithoutComma);
        console.log(response);
        if (response && response.Contests) {
          const events = response.Contests.map(contest => ({
            id: contest.id,
            title: contest.title,
            date: contest.date,
            time: contest.time,
          }));
          setContestEvents(events);
        }
      } catch (error) {
        console.error('Error fetching contest data:', error);
      }
    };
    fetchContestData();
  }, []);

  const [showModal, setShowModal] = useState(false);

  const getContestOnDate = async (formattedDate) => {
    try {
      const queryParams = { date: formattedDate };
      const encodedParams = Object.keys(queryParams)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
        .join('&');
  
      const baseUrl = 'http://127.0.0.1:8000/contest/contestOnDate';
      const completeUrl = `${baseUrl}?${encodedParams}`;
  
      const response = await fetch(completeUrl);
  
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  
  const findAllContests = async () => {
    try {
      const Url = 'http://127.0.0.1:8000/contest/allUpcomingAddedContests';
      const response = await fetch(Url);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleDateClick = async (selectInfo) => {
    const selectedDate = selectInfo.start;
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const date = selectedDate.getDate();
    const monthIndex = selectedDate.getMonth();
    const year = selectedDate.getFullYear();

    const formattedDate = `${date} ${monthNames[monthIndex]}, ${year}`;

    console.log("Selected date:", formattedDate);

    try {
      const contestData = await getContestOnDate(formattedDate);
      setContestEvents(contestData.Contests); // Assuming contestData is an object with a Contests array
    } catch (error) {
      console.error('Error fetching contest data:', error);
    }
  };

  const handleEventClick = (selected) => {
    if (
      window.confirm(
        `Are you sure you want to delete this contest? '${selected.event.title}'`
      )
    ) {
      selected.event.remove();
    }
  };

  return (
    <Box m="20px">
      <MenuHeader
        title="Upcoming Contests"
        subtitle="Find all the upcoming contests in one place!"
      />

      {showModal && (
        <Dialog
          open={showModal}
          onClose={() => setShowModal(false)}
          component="form"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            console.log(formJson.title, formJson.url); // NEED TO CREATE NEW EVENT WITH THESE

            setShowModal(false);
          }}
          PaperProps={{
            sx: {
              backgroundColor: colors.blueAccent[700],
              color: colors.primary[600],
              p: 2,
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }
          }}
        >
          <DialogTitle>Add New Contest</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the name and URL of the contest.
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="title"
              name="title"
              label="Title of Contest"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              required
              margin="dense"
              id="url"
              name="url"
              label="URL of Contest"
              type="url"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Done</Button>
          </DialogActions>
        </Dialog>
      )}

      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="10px"
          borderRadius="4px"
          height="65vh"
        >
          <Typography variant="h5">Contests</Typography>
          <List>
            {contestEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  margin: "10px 0",
                  borderRadius: "2px",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {event.time} {/* Display the time */}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="65vh"
            ml="10px"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            events={contestEvents} // Use contestEvents directly
            eventClick={handleEventClick}
            eventsSet={(events) => setCurrentEvents(events)}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default UpcomingContests;
