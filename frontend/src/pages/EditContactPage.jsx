import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getContactById, updateContact } from "../services/apiService";
import { TextField, Button, Paper, Typography, Box, CircularProgress } from "@mui/material";
import mockContacts from "../mockContacts";

const EditContactPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    job_title: "",
  });

  const [loading, setLoading] = useState(true); // Initial loading state
  const [error, setError] = useState(""); // Track error messages

  // const loadContact = async () => {
  //   try {
  //     const contact = await getContactById(id);
  //     setFormData(contact);
  //   } catch (err) {
  //     console.error("Error loading contact data:", err);
  //     setError("An error occurred while loading the contact data.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadContact = () => {
    try {
      let contact = {};
      for(let i = 0; i < mockContacts.length; i++) {
        if (mockContacts[i].id == id) {
          contact = mockContacts[i];
        }
      }
      setFormData(contact);
    } catch (err) {
      console.error("Error loading contact data:", err);
      setError("An error occurred while loading the contact data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContact();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error on new submission

    const phoneRegex = /^\+\d{1,3}\d{7,14}$/; // Enforce country code in phone number
    if (!phoneRegex.test(formData.phone)) {
      setLoading(false);
      setError("Phone number must include a valid country code (e.g., +91XXXXXXXXXX).");
      return;
    }

    try {
      for(let i = 0; i < mockContacts.length; i++) {
        if (mockContacts[i].id == id) {
          mockContacts[i] = formData;
        }
      }
      alert("Contact updated successfully!\nAs this is a demo, updation is not permanent.");
      navigate("/contacts");
    } catch (err) {
      if (err.response && err.response.data) {
        // Backend returned an error message
        setError(err.response.data.error || "An unexpected error occurred.");
      } else {
        // Generic fallback
        setError("An error occurred while updating the contact.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading contact data...</p>;

  return (
    <Paper elevation={3} style={{ padding: "25px", maxWidth: "600px", margin: "20px auto" }}>
      <Typography variant="h5" align="center" marginBottom={2} gutterBottom>
        Edit Contact
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
            disabled={loading} // Disable button while loading
          >
            {loading ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default EditContactPage;
