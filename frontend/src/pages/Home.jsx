import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        color: "text.primary",
      }}
    >
      <Container sx={{ textAlign: "center" }}>
        <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
          Welcome to Your Contact Manager
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Organize, manage, and keep track of all your important contacts in one place.
        </Typography>

        <Box>
          <Link to="/contacts">
            <Button
              variant="contained"
              color="primary"
              sx={{
                padding: "12px 24px",
                fontSize: "1rem",
                fontWeight: "bold",
                transition: "background-color 0.3s",
                "&:hover": {
                  backgroundColor: "#3f51b5",
                },
              }}
            >
              Start Managing Contacts
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
