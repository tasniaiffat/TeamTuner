import { useState } from "react";
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


const UpcomingContests = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentContests, setCurrentContests] = useState([]);
  const [showModal,setShowModal] = useState(false);

  const handleDateClick = (selected) => {
    setShowModal(true);
    
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: `${selected.dateStr}-${title}`,
        title,
        link:"url",
        start: selected.startStr,
        end: selected.endStr,
        allDay: selected.allDay,
      });
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

      {showModal && <FormDialog selected='true'/>}

      <MenuHeader
        title="Upcoming Contests"
        subtitle="Find all the upcoming contests in one place!"
      />
      

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
            {currentContests.map((event) => (
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
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })} <a href={event.url}>Contest Link</a>
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="15px" >
          <FullCalendar
            height="65vh"
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
            eventClick={handleEventClick}
            eventsSet={(events) => setCurrentContests(events)}
            initialEvents={[
              {
                id: "12315",
                title: "All-day event",
                url: "https://codeforces.com/contest/1970",
                date: "2022-09-14",
              },
              {
                id: "5123",
                title: "Timed event",
                url: "https://codeforces.com/contest/1970",
                date: "2022-09-28",
              },
            ]}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default UpcomingContests;
