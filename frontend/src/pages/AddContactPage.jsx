import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addContact } from "../services/apiService";
import { TextField, Button, Paper, Typography, Box, CircularProgress } from "@mui/material";
import mockContacts from "../mockContacts";

const AddContactPage = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    job_title: "",
  });

  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); 

    const phoneRegex = /^\+\d{1,3}\d{7,14}$/;
    if (!phoneRegex.test(formData.phone)) {
        setLoading(false);
        setError("Phone number must include a valid country code (e.g., +91XXXXXXXXXX).");
        return;
    }

    try {
        // await addContact(formData);
        mockContacts.push(formData); 
        setFormData({
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            company: "",
            job_title: "",
        });
        alert("Contact added successfully!\nAs this is a demo, addition is not permanent.");
        navigate("/contacts");
    } catch (err) {
        if (err.response && err.response.data) {
            setError(err.response.data.error || "An unexpected error occurred.");
        } else {
            setError("An error occurred while adding the contact.");
        }
    } finally {
        setLoading(false);
    }
};

  return (
    <Paper elevation={3} style={{ padding: "25px", maxWidth: "600px", margin: "20px auto" }}>
      <Typography variant="h5" align="center" marginBottom={2} gutterBottom>
        Add New Contact
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap="15px">
          <TextField
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
            helperText="Include country code (e.g., +91XXXXXXXXXX)"
          />

          <TextField
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
          <TextField
            label="Job Title"
            name="job_title"
            value={formData.job_title}
            onChange={handleChange}
          />
          {error && <Typography color="error">{error}</Typography>}

          <Button
            variant="contained"
            type="submit"
            sx={{
              padding: "10px 20px",
            }}
            disabled={loading} 
          >
            {loading ? <CircularProgress size={24} /> : "Add Contact"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default AddContactPage;
