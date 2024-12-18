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

export default function EmployeeManagement() {
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add', 'edit', 'view'
  const [dialogData, setDialogData] = useState({});
  const [employeeData, setEmployeeData] = useState({
    sickLeave: 4,
    casualLeave: 8,
    totalLeaveTaken: 0,
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    designation: '',
    department: {
      name: 'IT'
    },
    dateOfJoining: '',
    salary: 0,
    status: 'active',
    role: 'employee'
  });

  const [alertOpen, setAlertOpen] = useState(false); // Alert for isMarquee
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // Delete confirmation dialog
  const [jobToDelete, setJobToDelete] = useState(null); // Job to delete
  const [loading, setLoading] = useState(false); //loading state
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const [pendingCloseAction, setPendingCloseAction] = useState(null);
  const [department, setDepartment] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev); // Toggle password visibility
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    setLoading(true); // Start loading
    axiosInstance
      .get('/employees') // API to fetch employee data
      .then((response) => {
        const employees = response.data; // Assuming the response is an array of employees
        setJobs(employees); // Store the employee data in the state
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
      setEmployeeData({
        sickLeave: job.sickLeave || 4,
        casualLeave: job.casualLeave || 8,
        totalLeaveTaken: job.totalLeaveTaken || 0,
        employeeId: job.employeeId || null,
        firstName: job.firstName || '',
        lastName: job.lastName || '',
        email: job.email || '',
        phone: job.phone || '',
        address: job.address || '',
        designation: job.designation || '',
        department: {
          name: job.department ? job.department.name : 'IT'
        },
        dateOfJoining: job.dateOfJoining || '',
        salary: job.salary || '',
        status: job.status || 'active',
        role: job.role || 'employee'
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
    const loadingToastId = toast.loading('Submitting...', { // Show loading toast
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  
    try {
      if (dialogMode === 'add') {
        await axiosInstance.post('/employees', employeeData);
        toast.success('Employee added successfully!🎉');
      } else if (dialogMode === 'edit') {
        await axiosInstance.put(`/employees/${dialogData.id}`, employeeData);
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
      console.error('Error deleting the job:', error);
      toast.error('Something went Wrong in deleting the job!😠');
    }
  };

  // ################### Array of News Categories #############

  const getDepartment = () => {
    setLoading(true); // Start loading
    axiosInstance
      .get('/departments')
      .then((response) => {
        const departmentData = response.data;
        setDepartment(departmentData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching the departments:', error);
        toast.error('Something went wrong in fetching departments!😠', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getDepartment();
  }, []);

  return (
    <div>
      <h3
        style={{
          textAlign: 'right'
        }}
        onClick={() => handleClickOpen('add')}
      >
        <Button variant="contained" style={{ backgroundColor: "#008080" }}> Add New Employee</Button>
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
              <StyledTableCell>EMP. ID</StyledTableCell>
              <StyledTableCell>First Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Department</StyledTableCell>
              <StyledTableCell>Designation</StyledTableCell>
              <StyledTableCell>Address</StyledTableCell>
              <StyledTableCell>Date of Joining</StyledTableCell>

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
              Loading employees...
            </div>
          ) : (
            <TableBody>
              {jobs.map((job, index) => (
                <StyledTableRow key={job._id}>
                  <StyledTableCell component="th" scope="row">
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {job.employeeId}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {job.firstName}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {job.email}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {job.department?.name}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {job.designation}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {job.address}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {new Date(job.dateOfJoining).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </StyledTableCell>

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

              {/* Email and Phone */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <p>
                    <strong style={{ fontSize: '18px', color: '#008080' }}>Email:</strong>
                    <h3>{dialogData.email}</h3>
                  </p>
                </Grid>
                <Grid item xs={6}>
                  <p>
                    <strong style={{ fontSize: '18px', color: '#008080' }}>Phone:</strong>
                    <h3>{dialogData.phone}</h3>
                  </p>
                </Grid>
              </Grid>
              <hr />

              {/* Address and Designation */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <p>
                    <strong style={{ fontSize: '18px', color: '#008080' }}>Address:</strong>
                    <h3>{dialogData.address}</h3>
                  </p>
                </Grid>
                <Grid item xs={6}>
                  <p>
                    <strong style={{ fontSize: '18px', color: '#008080' }}>Designation:</strong>
                    <h3>{dialogData.designation}</h3>
                  </p>
                </Grid>
                <Grid item xs={6}>
                  <p>
                    <strong style={{ fontSize: '18px', color: '#008080' }}>Department:</strong>
                    <h3>{dialogData.department?.name}</h3>
                  </p>
                </Grid>
              </Grid>
              <hr />

              {/* Date of Joining and Sick Leave */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <p>
                    <strong style={{ fontSize: '18px', color: '#008080' }}>Date of Joining:</strong>
                    <h3>{new Date(dialogData.dateOfJoining).toLocaleDateString()}</h3>
                  </p>
                </Grid>
                <Grid item xs={6}>
                  <p>
                    <strong style={{ fontSize: '18px', color: '#008080' }}>Sick Leave:</strong>
                    <h3>{dialogData.sickLeave}</h3>
                  </p>
                </Grid>
              </Grid>
              <hr />

              {/* Casual Leave and Total Leave Taken */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <p>
                    <strong style={{ fontSize: '18px', color: '#008080' }}>Casual Leave:</strong>
                    <h3>{dialogData.casualLeave}</h3>
                  </p>
                </Grid>
                <Grid item xs={6}>
                  <p>
                    <strong style={{ fontSize: '18px', color: '#008080' }}>Total Leave Taken:</strong>
                    <h3>{dialogData.totalLeaveTaken}</h3>
                  </p>
                </Grid>
              </Grid>
              <hr />

              {/* Employee ID and Status */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <p>
                    <strong style={{ fontSize: '18px', color: '#008080' }}>Employee ID:</strong>
                    <h3>{dialogData.employeeId}</h3>
                  </p>
                </Grid>
                <Grid item xs={6}>
                  <p>
                    <strong style={{ fontSize: '18px', color: '#008080' }}>Status:</strong>
                    <h3>{dialogData.status}</h3>
                  </p>
                </Grid>
              </Grid>
              <hr />

              {/* Role and Salary */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <p>
                    <strong style={{ fontSize: '18px', color: '#008080' }}>Role:</strong>
                    <h3>{dialogData.role}</h3>
                  </p>
                </Grid>
                <Grid item xs={6}>
                  <p>
                    <strong style={{ fontSize: '18px', color: '#008080' }}>Salary:</strong>
                    <h3>{dialogData.salary}</h3>
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
                value={employeeData.employeeId}
                onChange={(e) => setEmployeeData({ ...employeeData, employeeId: e.target.value })}
                required
              />

              {/* First Name */}
              <label
                htmlFor="First Name"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder'
                }}
              >
                First Name
              </label>
              <TextField
                margin="dense"
                label="First Name"
                fullWidth
                variant="outlined"
                value={employeeData.firstName}
                onChange={(e) => setEmployeeData({ ...employeeData, firstName: e.target.value })}
                required
              />

              {/* Last Name */}
              <label
                htmlFor="Last Name"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder'
                }}
              >
                Last Name
              </label>
              <TextField
                margin="dense"
                label="Last Name"
                fullWidth
                variant="outlined"
                value={employeeData.lastName}
                onChange={(e) => setEmployeeData({ ...employeeData, lastName: e.target.value })}
                required
              />

              {/* Email */}
              <label
                htmlFor="Email"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder'
                }}
              >
                Email
              </label>
              <TextField
                margin="dense"
                label="Email"
                fullWidth
                variant="outlined"
                value={employeeData.email}
                onChange={(e) => setEmployeeData({ ...employeeData, email: e.target.value })}
                required
              />

              {/* Phone */}
              <label
                htmlFor="Phone"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder'
                }}
              >
                Phone
              </label>
              <TextField
                margin="dense"
                label="Phone"
                fullWidth
                variant="outlined"
                value={employeeData.phone}
                onChange={(e) => setEmployeeData({ ...employeeData, phone: e.target.value })}
                required
              />

              {/* Address */}
              <label
                htmlFor="Address"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder'
                }}
              >
                Address
              </label>
              <TextField
                margin="dense"
                label="Address"
                fullWidth
                variant="outlined"
                value={employeeData.address}
                onChange={(e) => setEmployeeData({ ...employeeData, address: e.target.value })}
                required
              />

              {/* Designation */}
              <label
                htmlFor="Designation"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder'
                }}
              >
                Designation
              </label>
              <TextField
                margin="dense"
                label="Designation"
                fullWidth
                variant="outlined"
                value={employeeData.designation}
                onChange={(e) => setEmployeeData({ ...employeeData, designation: e.target.value })}
                required
              />
              {/* ====================== || Department || ===================== */}

              <label
                id="category-label"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder'
                }}
              >
                Department
              </label>
              <br />
              <Select
                labelId="Department-label"
                fullWidth
                value={employeeData.department._id || ''} // Set to the department's _id
                onChange={(e) =>
                  setEmployeeData({
                    ...employeeData,
                    department: department.find((dep) => dep._id === e.target.value) // Find the selected department by its _id
                  })
                }
                label="Department"
                variant="outlined"
              >
                {department.map((dep) => (
                  <MenuItem key={dep._id} value={dep._id}>
                    {' '}
                    {/* Use dep._id as the value */}
                    {dep.name} {/* Display department name */}
                  </MenuItem>
                ))}
              </Select>

              {/* ====================== || Department || ===================== */}

              {/* Password */}
              <label
                htmlFor="Password"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder'
                }}
              >
                Create Password
              </label>
              <TextField
                margin="dense"
                label="Password"
                fullWidth
                variant="outlined"
                type={showPassword ? 'text' : 'password'} // Toggle between text and password
                value={employeeData.password}
                onChange={(e) => setEmployeeData({ ...employeeData, password: e.target.value })}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end" aria-label="toggle password visibility">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              {/* Date of Joining */}
              <label
                htmlFor="Date of Joining"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder'
                }}
              >
                Date of Joining
              </label>
              <TextField
                margin="dense"
                label="Date of Joining"
                fullWidth
                variant="outlined"
                type="date"
                value={employeeData.dateOfJoining}
                onChange={(e) => setEmployeeData({ ...employeeData, dateOfJoining: e.target.value })}
                required
              />

              {/* Salary */}
              {/* <label
                htmlFor="Salary"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder'
                }}
              >
                Salary
              </label>
              <TextField
                margin="dense"
                label="Salary"
                fullWidth
                variant="outlined"
                type="number"
                value={employeeData.salary}
                onChange={(e) => setEmployeeData({ ...employeeData, salary: e.target.value })}
                required
              /> */}

              {/* Status */}
              {/* <label
                htmlFor="Status"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder'
                }}
              >
                Status
              </label>
              <TextField
                margin="dense"
                label="Status"
                fullWidth
                variant="outlined"
                value={employeeData.status}
                onChange={(e) => setEmployeeData({ ...employeeData, status: e.target.value })}
                required
              /> */}

              {/* Role */}
              <label
                htmlFor="Role"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder'
                }}
              >
                Role
              </label>
              <TextField
                margin="dense"
                label="Role"
                fullWidth
                variant="outlined"
                value={employeeData.role}
                onChange={(e) => setEmployeeData({ ...employeeData, role: e.target.value })}
                required
              />
              {/* Sick Leave */}
              <label
                htmlFor="Sick Leave"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder'
                }}
              >
                Sick Leave
              </label>
              <TextField
                margin="dense"
                label="Sick Leave"
                fullWidth
                variant="outlined"
                type="number"
                value={employeeData.sickLeave}
                onChange={(e) => setEmployeeData({ ...employeeData, sickLeave: e.target.value })}
                required
              />

              {/* Casual Leave */}
              <label
                htmlFor="Casual Leave"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder'
                }}
              >
                Casual Leave
              </label>
              <TextField
                margin="dense"
                label="Casual Leave"
                fullWidth
                variant="outlined"
                type="number"
                value={employeeData.casualLeave}
                onChange={(e) => setEmployeeData({ ...employeeData, casualLeave: e.target.value })}
                required
              />

              {/* Total Leave Taken */}
              {/* <label
                htmlFor="Total Leave Taken"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder'
                }}
              >
                Total Leave Taken
              </label>
              <TextField
                margin="dense"
                label="Total Leave Taken"
                fullWidth
                variant="outlined"
                type="number"
                value={employeeData.totalLeaveTaken}
                onChange={(e) => setEmployeeData({ ...employeeData, totalLeaveTaken: e.target.value })}
                required
              /> */}
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
          <Typography>Are you sure you want to delete the job titled "{dialogData.firstName}"?</Typography>
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
