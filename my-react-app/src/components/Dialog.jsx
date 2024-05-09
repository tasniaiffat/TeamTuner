import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { tokens } from "../theme";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Typography,
    colors,
    useTheme,
  } from "@mui/material";


export default function FormDialog(selected) {

    const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [open, setOpen] = React.useState({selected});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setOpen(false);
    console.log(formData)
  };

  return (
    
    <React.Fragment>
      <Dialog
       backgroundColor = {colors.greenAccent} 
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const title = formJson.title;
            const url = formJson.url;
            console.log(title+url);
            handleClose();
          },
        }}
      >
        <DialogTitle>Add New Contest</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the name and url of the contest.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="title"
            name="Title of Contest"
            label="Title of Contest"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="url"
            name="URL of Contest"
            label="URL of Contest"
            type="url"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Done</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
