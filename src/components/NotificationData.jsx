import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Modal,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TablePagination,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import toast, { Toaster } from "react-hot-toast";
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

const NotificationData = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedContact, setSelectedContact] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetching data from the API
  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true); // Set loading to true before fetching data
      try {
        const response = await axiosInstance.get(
          `notification?page=${page + 1}&limit=${rowsPerPage}`
        );
        console.log("API Response:", response.data); // Log API response for debugging
        setContacts(response.data.data.allNotification); // Only update the current page contacts
        setTotalCount(response.data.data.totalCount || 0); // Fallback to 0 if undefined
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchContacts();
  }, [page, rowsPerPage]); // Fetch data when page or rows per page changes

  const handleOpenModal = (contact) => {
    setSelectedContact(contact);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenDialog = (contact) => {
    setContactToDelete(contact);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteContact = () => {
    axios
      .delete(
        `https://kindaspj.devapi.sarkariprivatejobs.com/api/v1/contact/${contactToDelete.id}`
      )
      .then(() => {
        setContacts(
          contacts.filter((contact) => contact.id !== contactToDelete.id)
        );
        setOpenDialog(false);
        toast.success("Data deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting contact:", error);
        toast.error("Failed to delete data");
      });
  };

  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when changing rows per page
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Title </StyledTableCell>
              <StyledTableCell>Body</StyledTableCell>
              <StyledTableCell>Image</StyledTableCell>
              <StyledTableCell>Sended At</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <StyledTableRow key={contact.id}>
                  <StyledTableCell>{contact.title}</StyledTableCell>
                  <StyledTableCell>{contact.msgbody}</StyledTableCell>
                  <StyledTableCell>
                    <img
                      src={contact.image}
                      alt="notification"
                      style={{ width: "100px", height: "auto" }}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    {new Date(contact.createdAt).toLocaleString()}
                  </StyledTableCell>

                  {/* <StyledTableCell>
                    <EyeOutlined
                      style={{
                        cursor: "pointer",
                        fontSize: "20px",
                        color: "green",
                        marginRight: "10px",
                      }}
                      onClick={() => handleOpenModal(contact)}
                    />
                    <DeleteOutlined
                      style={{
                        cursor: "pointer",
                        fontSize: "20px",
                        color: "red",
                      }}
                      onClick={() => handleOpenDialog(contact)}
                    />
                  </StyledTableCell> */}
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={8} align="center">
                  No data available
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={totalCount} // Use totalCount with fallback to 0
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]} // Rows per page options
        />
      </TableContainer>

      {/* Modal to display contact details */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h3" id="modal-modal-title" gutterBottom>
            Contact Details
          </Typography>
          <hr />
        </Box>
      </Modal>

      {/* Confirmation dialog for delete action */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this contact?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteContact} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Toaster />
    </>
  );
};

export default NotificationData;
