import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-hot-toast";
import axiosInstance from "utils/axiosInstance";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#008080",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function AdminManage() {
  const [admins, setAdmins] = useState([]);
  const [open, setOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "admin",
    password: "",
  });

  // Fetch admin data on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axiosInstance.get("/auth/admin/master/admin_list");
      setAdmins(response.data.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  // Handle opening the add admin dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Handle closing the dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Handle input change for new admin form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin({ ...newAdmin, [name]: value });
  };

  // Handle adding a new admin
  const handleAddAdmin = async () => {
    try {
      const response = await axiosInstance.post(
        "/auth/admin/master/createadmin",
        {
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
          password: newAdmin.password,
        }
      );
      toast.success("Admin created successfully!");
      fetchAdmins(); // Refresh admin list after creation
      setOpen(false); // Close the dialog
      setNewAdmin({ name: "", email: "", password: "" }); // Reset form
    } catch (error) {
      console.error("Error creating admin:", error);
      toast.error("Failed to create admin");
    }
  };

  return (
    <div>
      <h3
        style={{
          textAlign: "right",
        }}
      >
        <Button variant="contained" onClick={handleClickOpen}>
          Add New
        </Button>
      </h3>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Admin Name</StyledTableCell>
              <StyledTableCell align="right">Email</StyledTableCell>
              <StyledTableCell align="right">Created At</StyledTableCell>
              <StyledTableCell align="right">Updated At</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map((admin) => (
              <StyledTableRow key={admin.id}>
                <StyledTableCell component="th" scope="row">
                  {admin.name || "Testing Admin"}
                </StyledTableCell>
                <StyledTableCell align="right">{admin.email}</StyledTableCell>
                <StyledTableCell align="right">
                  {new Date(admin.createdAt).toLocaleString()}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {new Date(admin.updatedAt).toLocaleString()}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {/* Add action buttons like edit or delete */}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for adding new admin */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Admin</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Admin Name"
            fullWidth
            variant="outlined"
            value={newAdmin.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="email"
            type="email"
            label="Admin Email"
            fullWidth
            variant="outlined"
            value={newAdmin.email}
            onChange={handleInputChange}
          />
          <TextField
            autoFocus
            margin="dense"
            name="role"
            type="text"
            label="Admin Role"
            fullWidth
            variant="outlined"
            value={newAdmin.role}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="password"
            type="password"
            label="Admin Password"
            fullWidth
            variant="outlined"
            value={newAdmin.password}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddAdmin} variant="contained">
            Add Admin
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
