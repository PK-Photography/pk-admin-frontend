import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';

import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
  Alert,
  Grid,
  InputAdornment,
  IconButton,
  MenuItem,
  Select
} from '@mui/material';
import toast from 'react-hot-toast';
import axiosInstance from 'utils/axiosInstance';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#008080',
    color: theme.palette.common.white
  },

  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

export default function Bookings() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add', 'edit', 'view'
  const [dialogData, setDialogData] = useState({});
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    message: '',
    service: '',
    date: '',
    time: ''
  });

  const [alertOpen, setAlertOpen] = useState(false); // Alert for isMarquee
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // Delete confirmation dialog
  const [jobToDelete, setJobToDelete] = useState(null); // Job to delete
  const [loading, setLoading] = useState(false); //loading state
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const [pendingCloseAction, setPendingCloseAction] = useState(null);
  const [department, setDepartment] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    setLoading(true); // Start loading
    axiosInstance
      .get('/booking/all') // API to fetch employee data
      .then((response) => {
        const booking = response.data.data; // Assuming the response is an array of employees
        console.log(booking);
        setData(booking); // Store the employee data in the state
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        console.error('Error fetching the employees:', error);
        toast.error('Something went wrong in employee fetching!😠', error);
        setLoading(false); // Stop loading on error
      });
  };

  const handleClickOpen = (mode, job = {}) => {
    const loadingToastId = toast.loading('🖐️Hold on 🎁 Loading...', {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff'
      }
    });

    setDialogMode(mode);
    setDialogData(job);

    setTimeout(() => {
      setBookingData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        message: data.message || '',
        service: data.service || '',
        date: data.date || '',
        time: data.time || ''
      });

      toast.dismiss(loadingToastId);
      setOpen(true);
    }, 100);
  };

  const handleClose = (action = null) => {
    if (dialogMode === 'view') {
      // Directly close the dialog when in 'view' mode, no confirmation needed
      setOpen(false);
    } else {
      if (action === 'confirm') {
        setOpen(false); // Close the dialog if confirmed
      } else {
        setPendingCloseAction(action); // Store the action (outside click or cancel)
        setConfirmCloseOpen(true); // Open the confirmation dialog
      }
    }
  };

  const handleConfirmClose = (confirm) => {
    if (confirm) {
      setOpen(false); // Close if user confirms
    }
    setConfirmCloseOpen(false); // Close the confirmation dialog
  };

  const handleSubmit = async () => {
    const loadingToastId = toast.loading('Submitting...', {
      // Show loading toast
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff'
      }
    });

    try {
      if (dialogMode === 'add') {
        await axiosInstance.post('/employees', bookingData);
        toast.success('Employee added successfully!🎉');
      } else if (dialogMode === 'edit') {
        await axiosInstance.put(`/employees/${dialogData.id}`, bookingData);
        toast.success('Employee updated successfully!🖊️😍');
      }

      fetchEmployees(); // Refresh the data
      handleClose(); // Close the dialog

      toast.dismiss(loadingToastId); // Dismiss loading toast after success
    } catch (error) {
      console.error('Error submitting the form:', error);
      toast.error(`"😡Error hai: " ${error.response?.data?.error || 'Unknown error'}`);
      toast.dismiss(loadingToastId); // Dismiss loading toast if there's an error
    }
  };

  const handleDeleteDialogOpen = (job) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/employees/${jobToDelete.id}`);
      fetchEmployees();
      setDeleteDialogOpen(false);
      setJobToDelete(null);
      toast.success('Deleted Sucessfully🥲!');
    } catch (error) {
      console.error('Error deleting..:', error);
      toast.error('Something went Wrong in deleting!😠');
    }
  };

  // ################### Array of News Categories #############


  return (
    <div>
      <h3
        style={{
          textAlign: 'right'
        }}
        onClick={() => handleClickOpen('add')}
      >
        <Button variant="contained" style={{ backgroundColor: '#008080' }}>
          {' '}
          Add New Booking
        </Button>
      </h3>

      {alertOpen && (
        <Alert severity="warning" onClose={() => setAlertOpen(false)} style={{ marginBottom: '10px' }}>
          You can't add more than 5 Marquee Active jobs!
        </Alert>
      )}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Sr. No.</StyledTableCell>
              <StyledTableCell>name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>phone</StyledTableCell>
              <StyledTableCell>address</StyledTableCell>
              <StyledTableCell>service</StyledTableCell>
             

              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <div
              style={{
                textAlign: 'center',
                fontSize: '18px',
                color: '#008080'
              }}
            >
              Loading Bookings...
            </div>
          ) : (
            <TableBody>
              {data.map((job, index) => (
                <StyledTableRow key={job._id}>
                  <StyledTableCell component="th" scope="row">
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {job.name}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {job.email || '-'}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {job.phone || '-'}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {job.address}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {job.service}
                  </StyledTableCell>
                 
                  {/* <StyledTableCell component="th" scope="row">
                    {new Date(job.dateOfJoining).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </StyledTableCell> */}

                  <StyledTableCell align="right">
                    <EyeOutlined
                      style={{
                        cursor: 'pointer',
                        fontSize: '20px',
                        color: 'green',
                        marginRight: '8px'
                      }}
                      onClick={() => handleClickOpen('view', job)}
                    />
                    <EditOutlined
                      style={{
                        cursor: 'pointer',
                        fontSize: '20px',
                        color: 'blue',
                        marginRight: '8px'
                      }}
                      onClick={() => handleClickOpen('edit', job)}
                    />
                    <DeleteOutlined
                      style={{
                        cursor: 'pointer',
                        fontSize: '20px',
                        color: 'red'
                      }}
                      onClick={() => handleDeleteDialogOpen(job)}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      {/* Add/Edit/View Job Dialog */}
      <Dialog
        open={open}
        onClose={() => handleClose('outsideClick')} // Instead of directly closing
        disableBackdropClick
        maxWidth="md"
      >
        <DialogTitle>{dialogMode === 'add' ? 'Add Employee' : dialogMode === 'edit' ? 'Edit Employee' : 'Job Details'}</DialogTitle>
        <DialogContent>
          {dialogMode === 'view' ? (
            <>
              {/* First Name and Last Name */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <p>
                    <strong style={{ fontSize: '18px', color: '#008080' }}>First Name:</strong>
                    <h3>{dialogData.firstName}</h3>
                  </p>
                </Grid>
                <Grid item xs={6}>
                  <p>
                    <strong style={{ fontSize: '18px', color: '#008080' }}>Last Name:</strong>
                    <h3>{dialogData.lastName}</h3>
                  </p>
                </Grid>
              </Grid>
              <hr />
            </>
          ) : (
            <>
              {/* Employee ID */}
              <label
                htmlFor="Employee ID"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder'
                }}
              >
                Employee ID
              </label>
              <TextField
                margin="dense"
                label="Employee ID"
                fullWidth
                variant="outlined"
                value={bookingData.employeeId}
                onChange={(e) => setBookingData({ ...bookingData, employeeId: e.target.value })}
                required
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {dialogMode !== 'view' && (
            <Button onClick={handleSubmit} color="primary" variant="contained">
              {dialogMode === 'add' ? 'Add' : 'Update'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* close confirm */}
      <Dialog open={confirmCloseOpen}>
        <DialogTitle>Are you sure you want to close?</DialogTitle>
        <DialogActions>
          <Button onClick={() => handleConfirmClose(true)}>Yes</Button>
          <Button onClick={() => handleConfirmClose(false)}>No</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Job</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this Data "{dialogData.name}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
