import React, { useState, useEffect } from "react";
import { fetchContacts, deleteContact } from "../services/apiService";
import mockContacts from "../mockContacts.jsx";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Button,
  TextField,
  Box,
  Typography,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("first_name");
  const navigate = useNavigate();

  // const loadContacts = async () => {
  //   try {
  //     const data = await fetchContacts();
  //     setContacts(data);
  //     setFilteredContacts(data);
  //   } catch (error) {
  //     console.error("Error fetching contacts:", error);
  //   }
  // };

  const loadContacts = () => {
    try {
      setContacts(mockContacts);
      setFilteredContacts(mockContacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };
  
  // const handleDelete = async (id) => {
  //   try {
  //     await deleteContact(id);
  //     loadContacts();
  //     alert("Contact deleted successfully!");
  //   } catch (error) {
  //     console.error("Error deleting contact:", error);
  //   }
  // };

  const handleDelete = (id) => {
    try {
      setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== id));
      setFilteredContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== id));
      alert("Contact deleted successfully!\nAs this is a demo, deletion is not permanent.");
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };
  
  const handleEdit = (id) => {
    navigate(`/edit-contact/${id}`);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value === "") {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(
        (contact) =>
          contact.first_name.toLowerCase().includes(value.toLowerCase()) ||
          contact.last_name.toLowerCase().includes(value.toLowerCase()) ||
          contact.email.toLowerCase().includes(value.toLowerCase()) ||
          contact.phone.toLowerCase().includes(value.toLowerCase()) ||
          contact.company.toLowerCase().includes(value.toLowerCase()) ||
          contact.job_title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortContacts = (array) => {
    return array.sort((a, b) => {
      if (orderBy === "first_name") {
        if (order === "asc") return a.first_name.localeCompare(b.first_name);
        else return b.first_name.localeCompare(a.first_name);
      }
      if (orderBy === "last_name") {
        if (order === "asc") return a.last_name.localeCompare(b.last_name);
        else return b.last_name.localeCompare(a.last_name);
      }
      return 0;
    });
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const sortedContacts = sortContacts(filteredContacts);
  const paginatedContacts = sortedContacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box
      sx={{
        padding: "25px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", fontSize: "2.5rem", marginBottom: "20px" }}>
        Contact List
      </Typography>

      <TextField
        label="Search Contacts"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{
          width: "100%",
          maxWidth: "500px",
          marginBottom: "25px",
          backgroundColor: "#fff",
          fontSize: "1rem",
        }}
      />

      <TableContainer component={Paper} sx={{ width: "100%", maxWidth: "1200px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sortDirection={orderBy === "first_name" ? order : false}
                sx={{
                  backgroundColor: "#808080",
                  color: "#fff",
                  fontSize: "1.1rem",
                  fontWeight: "normal", 
                  padding: "12px 16px",
                }}
              >
                <TableSortLabel
                  active={orderBy === "first_name"}
                  direction={orderBy === "first_name" ? order : "asc"}
                  onClick={() => handleRequestSort("first_name")}
                  sx={{
                    color: orderBy === "first_name" ? "#f4f4f4" : "#fff", 
                    "&:hover": {
                      color: orderBy === "first_name" ? "#f4f4f4" : "#fff", 
                    },
                  }}
                >
                  First Name
                </TableSortLabel>

              </TableCell>
              <TableCell
                sortDirection={orderBy === "last_name" ? order : false}
                sx={{
                  backgroundColor: "#808080",
                  color: "#fff",
                  fontSize: "1.1rem",
                  fontWeight: "normal", 
                  padding: "12px 16px",
                }}
              >
                <TableSortLabel
                  active={orderBy === "last_name"}
                  direction={orderBy === "last_name" ? order : "asc"}
                  onClick={() => handleRequestSort("last_name")}
                  sx={{
                    color: orderBy === "last_name" ? "#f4f4f4" : "#fff", 
                    "&:hover": {
                      color: orderBy === "last_name" ? "#f4f4f4" : "#fff", 
                    },
                  }}
                >
                  Last Name
              </TableSortLabel>

              </TableCell>
              <TableCell sx={{ backgroundColor: "#808080", color: "#fff", fontSize: "1.1rem", fontWeight: "normal" }}>
                Email
              </TableCell>
              <TableCell sx={{ backgroundColor: "#808080", color: "#fff", fontSize: "1.1rem", fontWeight: "normal" }}>
                Phone
              </TableCell>
              <TableCell sx={{ backgroundColor: "#808080", color: "#fff", fontSize: "1.1rem", fontWeight: "normal" }}>
                Company
              </TableCell>
              <TableCell sx={{ backgroundColor: "#808080", color: "#fff", fontSize: "1.1rem", fontWeight: "normal" }}>
                Job Title
              </TableCell>
              <TableCell sx={{ backgroundColor: "#808080", color: "#fff", fontSize: "1.1rem", fontWeight: "normal" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedContacts.map((contact, index) => (
              <TableRow
                key={contact.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff", 
                  "&:hover": {
                    backgroundColor: "#e3f2fd", 
                  },
                }}
              >
                <TableCell>{contact.first_name}</TableCell>
                <TableCell>{contact.last_name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>{contact.company}</TableCell>
                <TableCell>{contact.job_title}</TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    onClick={() => handleEdit(contact.id)}
                    sx={{ marginRight: "10px", fontSize: "0.875rem" }}
                  >
                    Edit
                  </Button>
                  <Button
                    color="secondary"
                    variant="contained"
                    size="small"
                    onClick={() => handleDelete(contact.id)}
                    sx={{ fontSize: "0.875rem" }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredContacts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ fontSize: "1rem" }}
      />
    </Box>
  );
};

export default ContactsPage;
