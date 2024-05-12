import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { tokens } from "../../theme";
import { Tooltip, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const AddContest = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //control the form dialog for manual entry of offline contest
  const [showModal, setShowModal] = useState(false);

  // Initial data
  const [topItems, setTopItems] = useState([
    {
      id: "cf-div3",
      title: "Codeforces Div 3",
      date: "13 May, 2024",
      time: "8:30 p.m.",
    },
    {
      id: "cf-div2",
      title: "Codeforces Div 2",
      date: "14 May, 2024",
      time: "9:00 a.m.",
    },
  ]);

  const [bottomItems, setBottomItems] = useState([
    {
      id: "cf-div1",
      title: "Codeforces Div 1",
      date: "15 May, 2024",
      time: "6:00 p.m.",
    },
    {
      id: "cf-div4",
      title: "Codeforces Div 4",
      date: "16 May, 2024",
      time: "7:00 a.m.",
    },
  ]);

  // Function to parse date and time strings into a JavaScript Date object
  const parseDateTime = (dateStr, timeStr) => {
    const [datePart, timePart, meridian] = timeStr.split(/[:.\s]/);
    let [hour, minute] = [parseInt(datePart), parseInt(timePart)];
    if (meridian === "p.m." && hour < 12) hour += 12;
    if (meridian === "a.m." && hour === 12) hour = 0;
    return new Date(`${dateStr} ${hour}:${minute}`);
  };

  // Function to sort the contest by time
  const sortByDateTime = (items) =>
    items.sort(
      (a, b) => parseDateTime(a.date, a.time) - parseDateTime(b.date, b.time)
    );

  // Hook to update the sorted lists when the component renders or data changes
  useEffect(() => {
    setTopItems(sortByDateTime(topItems));
    setBottomItems(sortByDateTime(bottomItems));
  }, [topItems, bottomItems]);

  // Move items between the two lists
  const moveItem = (item, from, to, setFrom, setTo) => {
    const filteredItems = from.filter((i) => i.id !== item.id);
    setFrom(sortByDateTime(filteredItems));
    setTo(sortByDateTime([...to, item]));
  };

  // Helper function to format the list item's text
  const formatListItem = (item) => `${item.title} - ${item.date} ${item.time}`;

  return (
    <>
      <Box m="20px" sx={{ bgcolor: colors.primary[400] }}>
        {/* Primary List */}
        <nav aria-label="primary task folders">
          <List>
            <Typography
              ml="18px"
              color={colors.greenAccent[500]}
              variant="h5"
              gutterBottom
            >
              Added Contests
            </Typography>

            {topItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  onClick={() =>
                    moveItem(
                      item,
                      topItems,
                      bottomItems,
                      setTopItems,
                      setBottomItems
                    )
                  }
                >
                  <ListItemIcon>
                    <CheckBoxIcon style={{ color: colors.greenAccent[500] }} />
                  </ListItemIcon>
                  <ListItemText primary={formatListItem(item)} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </nav>
        {/* Divider between lists */}
        <Divider />
        {/* Secondary List */}
        <nav aria-label="secondary task folders">
          <List>
            <Typography
              ml="18px"
              color={colors.redAccent[500]}
              variant="h5"
              gutterBottom
            >
              Removed Contests
            </Typography>
            {bottomItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  onClick={() =>
                    moveItem(
                      item,
                      bottomItems,
                      topItems,
                      setBottomItems,
                      setTopItems
                    )
                  }
                >
                  <ListItemIcon>
                    <CheckBoxOutlineBlankIcon
                      style={{ color: colors.redAccent[500] }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={formatListItem(item)} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </nav>

        <Tooltip title="Add Offline Contest" placement="top">
          <IconButton
            onClick={() => setShowModal(true)}
            style={{
              color: colors.greenAccent[400],
              position: "fixed",
              bottom: 20,
              right: 20,
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>

        {showModal && (
          <Dialog
            open={showModal}
            onClose={() => setShowModal(false)}
            component="form"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              // Assuming formJson now includes title, date, and time
              const newItem = {
                id: new Date().getTime().toString(), // unique ID based on timestamp
                title: formJson.title,
                date: formJson.date,
                time: formJson.time,
              };
              setTopItems([...topItems, newItem]); // Add to top items list
              setShowModal(false);
            }}
            PaperProps={{
              sx: {
                backgroundColor: colors.blueAccent[700],
                color: colors.primary[600],
                p: 2,
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            <DialogTitle>
              <h3>Add New Contest</h3>
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                required
                margin="dense"
                id="title"
                name="title"
                label="Title of Contest"
                type="text"
                fullWidth
                variant="outlined"
              />
              <TextField
                required
                margin="dense"
                id="date"
                name="date"
                label=""
                type="date"
                fullWidth
                variant="outlined"
              />
              <TextField
                required
                margin="dense"
                id="time"
                name="time"
                label=""
                type="time"
                fullWidth
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit">Done</Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </>
  );
};

export default AddContest;
