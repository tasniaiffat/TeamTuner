import React, { useState } from "react";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import Header from "../Header/Header";
import { tokens } from "../theme";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("Form Data:", formData);

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Email and Password Do Not Match");
      }

      const data = await response.json();
      console.log(data); // Log the response or handle accordingly
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleRegisterLink() {
    navigate("..");
  }

  return (
    <Box
      m="20px"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
        maxWidth: 500,
        maxHeight: 500,
        margin: "auto",
        overflowY: "auto",
        maxHeight: "80vh",
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Header />
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        {[
          { label: "Email Address", name: "email", type: "email" },
          { label: "Password", name: "password", type: "password" }
        ].map(({ label, name, type }) => (
          <TextField
            key={name}
            label={label}
            name={name}
            type={type}
            value={formData[name]}
            onChange={handleChange}
            required
            margin="normal"
            fullWidth
            sx={{
              backgroundColor: "transparent", // Transparent background
              input: { color: colors.grey[100] }, // Adjust text color
              ".MuiInputLabel-root": { color: colors.grey[300] }, // Label color
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: colors.grey[300], // Border color
                },
                "&:hover fieldset": {
                  borderColor: colors.grey[100], // Hover state color
                },
                "&.Mui-focused fieldset": {
                  borderColor: colors.blueAccent[400], // Focused state color
                },
              },
            }}
          />
        ))}

        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 2,
            mb: 2,
            ml: 27,
            backgroundColor: colors.blueAccent[400],
            color: colors.grey[100],
            "&:hover": {
              backgroundColor: colors.blueAccent[800], // Hover state color
            },
          }}
        >
          Login
        </Button>
      </form>
      <Box className="register-link" onClick={handleRegisterLink}>
        <Typography>
          Don't have an account? <a href="#">Register</a>
        </Typography>
      </Box>
    </Box>
  );
}

export default Login;
