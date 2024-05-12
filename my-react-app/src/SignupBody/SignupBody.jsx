import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../Header/Header";

import { tokens } from "../theme";

function SignupBody() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    reg_number: "",
    session: "",
    department: "",
    cf_handle: "",
    codechef_handle: "",
    atcoder_handle: "",
    vjudge_handle: "",
  });

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("Form Data:", formData);

    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }

    const { confirm_password, ...formDataWithoutConfirmPassword } = formData;

    try {
      const response = await fetch("http://127.0.0.1:8000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithoutConfirmPassword),
      });

      if (!response.ok) {
        throw new Error("Failed to create user account");
      }

      toast.success("User account created successfully");
      navigate("./login");
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while creating the account");
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleLoginLink() {
    navigate("./login");
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
        Sign Up
      </Typography>
      <form onSubmit={handleSubmit}>
        {[
          { label: "First Name", name: "first_name", type: "text" },
          { label: "Last Name", name: "last_name", type: "text" },
          { label: "Email Address", name: "email", type: "email" },
          { label: "Registration Number", name: "reg_number", type: "text" },
          { label: "Department", name: "department", type: "text" },
          { label: "Session", name: "session", type: "text" },
          { label: "Password", name: "password", type: "password" },
          {
            label: "Confirm Password",
            name: "confirm_password",
            type: "password",
          },
          { label: "Codeforces Handle", name: "cf_handle", type: "text" },
          { label: "Codechef Handle", name: "codechef_handle", type: "text" },
          { label: "Atcoder Handle", name: "atcoder_handle", type: "text" },
          { label: "Vjudge Handle", name: "vjudge_handle", type: "text" },
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
          />
        ))}

        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 2,
            mb: 2,
            ml: 25,
            backgroundColor: colors.blueAccent[400], 
            color: colors.grey[100],
            "&:hover": {
              backgroundColor: colors.blueAccent[800], // Hover state color
            },
          }}
        >
          Sign Up
        </Button>
      </form>
      <Box className="login-link" onClick={handleLoginLink}>
        <Typography>
          Already have an account? <a href="#">Login</a>
        </Typography>
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default SignupBody;
