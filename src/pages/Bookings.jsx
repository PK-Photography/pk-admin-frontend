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
    color: theme.palette.common.white,
     textAlign: 'center',
  },

  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
     textAlign: 'center',
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
  const [dataToDelete, setDataToDelete] = useState(null); // Job to delete
  const [loading, setLoading] = useState(false); //loading state
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const [pendingCloseAction, setPendingCloseAction] = useState(null);
  const [department, setDepartment] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = () => {
    setLoading(true); // Start loading
    axiosInstance
      .get('/booking/all') // API to fetch employee data
      .then((response) => {
        const booking = response.data.data; // Assuming the response is an array of employees

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
        name: job.name || '',
        email: job.email || '',
        phone: job.phone || '',
        address: job.address || '',
        message: job.message || '',
        service: job.service || '',
        date: job.date || '',
        time: job.time || ''
      });

      toast.dismiss(loadingToastId);
      setOpen(true);
    }, 100);



  }


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
        await axiosInstance.post('/booking/request', bookingData);
        toast.success('Booking added successfully!🎉');
      } else if (dialogMode === 'edit') {
        await axiosInstance.put(`/booking/${dialogData._id}`, bookingData);

        toast.success('Booking updated successfully!🖊️😍');
      }

      fetchAllBookings(); // Refresh the data
      handleClose(); // Close the dialog

      toast.dismiss(loadingToastId); // Dismiss loading toast after success
    } catch (error) {
      console.error('Error submitting the form:', error);
      toast.error(`"😡Error hai: " ${error.response?.data?.error || 'Unknown error'}`);
      toast.dismiss(loadingToastId); // Dismiss loading toast if there's an error
    }
  };

  const handleDeleteDialogOpen = (job) => {
    setDataToDelete(job);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/booking/${dataToDelete._id}`);
      fetchAllBookings();
      setDeleteDialogOpen(false);
      setDataToDelete(null);
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
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Time</StyledTableCell>
              <StyledTableCell>Created At</StyledTableCell>
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
                    {new Date(job.date).toLocaleDateString('en-GB') || '-'}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {job.time || '-'}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                     {new Date(job.createdAt).toLocaleString('en-GB') || '-'}
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
        <DialogTitle>{dialogMode === 'add' ? 'Add Booking' : dialogMode === 'edit' ? 'Edit Booking' : 'Job Details'}</DialogTitle>
        <DialogContent>
          {dialogMode === 'view' ? (
            <>
              {/* First Name and Last Name
              <Grid container spacing={2} style={{ minWidth: "500px", padding: "10px" }}>
                <Grid item xs={6}>
                  <p>
                    <strong style={{ fontSize: '18px', color: '#008080' }}>Name:</strong>
                    <h3>{dialogData.name}</h3>
                  </p>
                </Grid>

                <Grid item xs={6}>
                  <p>
                    <strong style={{ fontSize: '18px', color: '#008080' }}>Email:</strong>
                    <h3>{dialogData.email}</h3>
                  </p>
                </Grid>
              </Grid>
              <hr /> */}


              <>
                {/* First Name and Last Name */}
                <Grid container spacing={2} style={{ minWidth: "500px", padding: "10px" }}>
                  <Grid item xs={6}>
                    <p>
                      <strong style={{ fontSize: '18px', color: '#008080' }}>Name:</strong>
                      <h3>{dialogData.name}</h3>
                    </p>
                  </Grid>

                  <Grid item xs={6}>
                    <p>
                      <strong style={{ fontSize: '18px', color: '#008080' }}>Email:</strong>
                      <h3>{dialogData.email}</h3>
                    </p>
                  </Grid>
                </Grid>

                {/* Phone and Address */}
                <Grid container spacing={2} style={{ minWidth: "500px", padding: "10px" }}>
                  <Grid item xs={6}>
                    <p>
                      <strong style={{ fontSize: '18px', color: '#008080' }}>Phone:</strong>
                      <h3>{dialogData.phone}</h3>
                    </p>
                  </Grid>

                  <Grid item xs={6}>
                    <p>
                      <strong style={{ fontSize: '18px', color: '#008080' }}>Address:</strong>
                      <h3>{dialogData.address}</h3>
                    </p>
                  </Grid>
                </Grid>

                {/* Message and Service */}
                <Grid container spacing={2} style={{ minWidth: "500px", padding: "10px" }}>
                  <Grid item xs={6}>
                    <p>
                      <strong style={{ fontSize: '18px', color: '#008080' }}>Message:</strong>
                      <h3>{dialogData.message}</h3>
                    </p>
                  </Grid>

                  <Grid item xs={6}>
                    <p>
                      <strong style={{ fontSize: '18px', color: '#008080' }}>Service:</strong>
                      <h3>{dialogData.service}</h3>
                    </p>
                  </Grid>
                </Grid>

                {/* Date and Time */}
                <Grid container spacing={2} style={{ minWidth: "500px", padding: "10px" }}>
                  <Grid item xs={6}>
                    <p>
                      <strong style={{ fontSize: '18px', color: '#008080' }}>Date:</strong>
                      <h3>{dialogData.date}</h3>
                    </p>
                  </Grid>

                  <Grid item xs={6}>
                    <p>
                      <strong style={{ fontSize: '18px', color: '#008080' }}>Time:</strong>
                      <h3>{dialogData.time}</h3>
                    </p>
                  </Grid>
                </Grid>

                <hr />
              </>

            </>
          ) : (
            <>
              {/* User Name */}
              <label
                htmlFor="Name"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder'
                }}
              >
                Name
              </label>
              <TextField
                margin="dense"
                label="Name"
                fullWidth
                variant="outlined"
                value={bookingData.name}
                onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                required
              />


              {/* Email */}
              <label
                htmlFor="Email"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder',
                }}
              >
                Email
              </label>
              <TextField
                margin="dense"
                label="Email"
                fullWidth
                variant="outlined"
                value={bookingData.email}
                onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                required
              />

              {/* Phone */}
              <label
                htmlFor="Phone"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder',
                }}
              >
                Phone
              </label>
              <TextField
                margin="dense"
                label="Phone"
                fullWidth
                variant="outlined"
                value={bookingData.phone}
                onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                required
              />

              {/* Address */}
              <label
                htmlFor="Address"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder',
                }}
              >
                Address
              </label>
              <TextField
                margin="dense"
                label="Address"
                fullWidth
                variant="outlined"
                value={bookingData.address}
                onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
                required
              />

              {/* Message */}
              <label
                htmlFor="Message"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder',
                }}
              >
                Message
              </label>
              <TextField
                margin="dense"
                label="Message"
                fullWidth
                variant="outlined"
                value={bookingData.message}
                onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
              />

              {/* Service */}
              <label
                htmlFor="Service"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder',
                }}
              >
                Service
              </label>
              <TextField
                select
                margin="dense"
                label="Service"
                fullWidth
                variant="outlined"
                value={bookingData.service}
                onChange={(e) => setBookingData({ ...bookingData, service: e.target.value })}
                SelectProps={{
                  native: true,
                }}
                required
              >
                <option value="">Select a service</option>
                <option value="Headshots">Headshots</option>
                <option value="Portrait">Portrait</option>
                <option value="Wedding & Events">Wedding & Events</option>
                <option value="Interior">Interior</option>
                <option value="Other">Other</option>
              </TextField>

              {/* Date */}
              <label
                htmlFor="Date"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder',
                }}
              >
                Date
              </label>
              <TextField
                type="date"
                margin="dense"
                fullWidth
                variant="outlined"
                value={bookingData.date}
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                required
              />

              {/* Time */}
              <label
                htmlFor="Time"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder',
                }}
              >
                Time
              </label>
              <TextField
                type="time"
                margin="dense"
                fullWidth
                variant="outlined"
                value={bookingData.time}
                onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
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
