import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Switch from '@mui/material/Switch';
import TablePagination from '@mui/material/TablePagination';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
  Alert,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import toast from 'react-hot-toast';
import axiosInstance from 'utils/axiosInstance';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

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

export default function Clients() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [open, setOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add', 'edit', 'view'
  const [dialogData, setDialogData] = useState({});
  const [formValues, setFormValues] = useState({
    name: '',
    imageUrl: null,
    category: '',
    date: '',
    canDownload: true,
    canView: true,
    pin: '',
    url: ''
  });
  const [alertOpen, setAlertOpen] = useState(false); // Alert for isMarquee
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // Delete confirmation dialog
  const [jobToDelete, setJobToDelete] = useState(null); // Job to delete
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const [pendingCloseAction, setPendingCloseAction] = useState(null);
  const [orderNo, setOrderNo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState(''); // New category name
  const [deriveLink, setDeriveLink] = useState(''); // New category image link
  const [selectedClientId, setSelectedClientId] = useState('');
  useEffect(() => {
    fetchNews(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const fetchNews = (page, rowsPerPage) => {
    axiosInstance
      .get(`/cards`)
      .then((response) => {
        const newsData = response.data;
        setJobs(newsData);
      })
      .catch((error) => {
        console.error('Error fetching the jobs:', error);
        toast.error('Something went Wrong in job fetching!😠');
      });
  };

  const handleChangePage = (event, newPage) => {
    toast.success('Page Changed!🌈');

    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page on changing rows per page
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
      setFormValues({
        name: job.name || '',
        date: job.date || '',
        imageUrl: job.image || null,
        category: job.category || '',
        canDownload: job.canDownload || true,
        canView: job.canView || true,
        pin: job.pin || '',
        url: job.url || ''
      });

      toast.dismiss(loadingToastId);
      setOpen(true);
    }, 100);
  };

  const handleClose = (action = null) => {
    if (action === 'confirm') {
      setOpen(false); // Close the dialog if confirmed
    } else {
      setPendingCloseAction(action); // Store the action (outside click or cancel)
      setConfirmCloseOpen(true); // Open the confirmation dialog
    }
  };

  // For cancel button:
  const handleClickCancel = () => {
    handleClose('cancel');
  };

  const handleConfirmClose = (confirm) => {
    if (confirm) {
      setOpen(false); // Close if user confirms
    }
    setConfirmCloseOpen(false); // Close the confirmation dialog
  };

  const handleSubmit = async () => {
    const loadingToast = toast.loading('Processing your request...'); // Show a loading toast
    try {
      if (dialogMode === 'add') {
        const cardData = {
          name: formValues.name,
          date: formValues.date,
          image: formValues.image,
          pin: formValues.pin,
          url: formValues.url,
        };

        try {
          await axiosInstance.post('/upload', cardData);
          toast.success('News Posted Successfully!🎉');
        } catch (error) {
          const msg =
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Unknown error";
        
          toast.error(`Error: ${msg}`);
        
          if (msg.toLowerCase().includes("already exists")) {
            setFormValues((prev) => ({
              ...prev,
              name: "",
            }));
          }
        
          console.error("Error submitting the form:", error);
        }
      } else if (dialogMode === 'edit') {
        const cardData = {
          name: formValues.name,
          date: formValues.date,
          image: formValues.image,
          pin: formValues.pin,
          url: formValues.url
        };

        await axiosInstance.put(`/card/update/${dialogData._id}`, cardData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('News Edited Successfully!🖊️😍');
      } else if (dialogMode === 'editOrder') {
        const newCategory = {
          name: categoryName,
          images: deriveLink
        };
        await axiosInstance.put(
          '/cards/update-category',
          {
            id: selectedClientId,
            category: newCategory
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        toast.success('Category updated Successfully!🖊️😍');
      }

      fetchNews(page, rowsPerPage); // Refresh the data
      handleClose();
    } catch (error) {
      console.error('Error submitting the form:', error);
      toast.error(`Error: ${error.response?.data?.message || 'Unknown error'}`);
    } finally {
      toast.dismiss(loadingToast); // Dismiss the loading toast once the operation is done
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB. Please upload a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormValues((prev) => ({
        ...prev,
        image: reader.result // Set Base64 string
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteDialogOpen = (job) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    const loadingToast = toast.loading('Processing delete request...');
    setLoading(true);

    try {
      await axiosInstance.delete(`/cards/${jobToDelete._id}`);
      fetchNews(page, rowsPerPage);
      setDeleteDialogOpen(false);
      setJobToDelete(null);
      toast.success('Deleted Successfully🥲!'); // Show success toast after deletion
    } catch (error) {
      console.error('Error deleting the job:', error);
      toast.error('Something went wrong in deleting the job!😠'); // Show error toast if something goes wrong
    } finally {
      setLoading(false); // Set loading state to false after the request completes
      toast.dismiss(loadingToast); // Dismiss the loading toast once the operation is done
    }
  };

  const handleCategoryDelete = async () => {};

  const handleCanDownloadStatus = async (job) => {
    try {
      const updatedStatus = { canDownload: !job.canDownload }; // Only send necessary data

      await axiosInstance.put(`/card/update/${job._id}`, updatedStatus);

      toast.success(`Card status updated to ${!job.canDownload ? 'Enabled' : 'Disabled'} 🎉`);

      // Optimistically update UI state instead of refetching everything
      setJobs((prevJobs) => prevJobs.map((j) => (j._id === job._id ? { ...j, canDownload: !job.canDownload } : j)));
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Error updating job status! 😠');
    }
  };
  const handleCanViewStatus = async (job) => {
    try {
      const updatedStatus = { canView: !job.canView }; // Only send necessary data

      await axiosInstance.put(`/card/update/${job._id}`, updatedStatus);

      toast.success(`Card status updated to ${!job.canView ? 'Enabled' : 'Disabled'} 🎉`);

      // Optimistically update UI state instead of refetching everything
      setJobs((prevJobs) => prevJobs.map((j) => (j._id === job._id ? { ...j, canView: !job.canView } : j)));
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Error updating job status! 😠');
    }
  };

  return (
    <div>
      <h3
        style={{
          textAlign: 'right'
        }}
        onClick={() => handleClickOpen('add')}
      >
        <Button variant="contained"> Add New Client</Button>
      </h3>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Sr. No.</StyledTableCell>
              <StyledTableCell>name</StyledTableCell>
              <StyledTableCell>PIN</StyledTableCell>
              <StyledTableCell>URL</StyledTableCell>
              <StyledTableCell align="right">Category</StyledTableCell>
              <StyledTableCell align="right">Date</StyledTableCell>
              <StyledTableCell align="right">Img</StyledTableCell>
              <StyledTableCell align="right">Download</StyledTableCell>
              <StyledTableCell align="right">View</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs?.map((job, index) => (
              <StyledTableRow key={job.id}>
                <StyledTableCell component="th" scope="row">
                  {index + 1}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {job.name.substring(0, 80)}
                  {job.name.length > 80 && '...'}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {job.pin}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {job.url}
                </StyledTableCell>

                <StyledTableCell align="right">
                  {job.category && job.category.length > 0
                    ? job.category.map((cat, index) => (
                        <span key={cat._id}>
                          {cat.name}
                          {index < job.category.length - 1 && ', '}
                        </span>
                      ))
                    : '-'}
                  <EditOutlined
                    style={{
                      cursor: 'pointer',
                      fontSize: '15px',
                      color: 'blue',
                      marginLeft: '5px'
                    }}
                    onClick={() => handleClickOpen('editOrder', job)}
                  />
                </StyledTableCell>

                <StyledTableCell align="right">
                  {/* {job.date || "-"} */}
                  {new Date(job.updatedAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <img
                    src={job.imageUrl}
                    alt="Job Image"
                    style={{ maxWidth: '100px', height: 'auto' }} // Adjust width and height as needed
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Switch checked={job.canDownload} onChange={() => handleCanDownloadStatus(job)} />
                </StyledTableCell>

                <StyledTableCell align="right">
                  <Switch
                    checked={job.canView}
                    onChange={() => handleCanViewStatus(job)}
                  />
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
        </Table>
        <TablePagination
          component="div"
          count={totalItems}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add/Edit/View Job Dialog */}
      <Dialog
        open={open}
        onClose={() => handleClose('outsideClick')} // Instead of directly closing
        disableBackdropClick
        maxWidth="md "
        style={{ minWidth: '900px' }}
      >
        <DialogTitle>
          {dialogMode === 'add'
            ? 'Add Client'
            : dialogMode === 'edit'
              ? 'Edit Client'
              : dialogMode === 'editOrder'
                ? 'Edit Order'
                : 'Job Details'}
        </DialogTitle>

        <DialogContent style={{ minWidth: '500px' }}>
          {dialogMode === 'view' ? (
            <>
              <p>
                <strong style={{ fontSize: '18px', color: '#008080' }}>Name</strong> <h3> {dialogData.name}</h3>
              </p>
              <p>
                <strong style={{ fontSize: '18px', color: '#008080' }}>Category</strong>{' '}
                {/* <h3> {dialogData.category || "No Caregory "} */}
                <h3>
                  {dialogData.category && dialogData.category.length > 0
                    ? dialogData.category.map((cat, index) => (
                        <span key={cat._id}>
                          {cat.name}
                          {index < dialogData.category.length - 1 && ', '}
                        </span>
                      ))
                    : '-'}
                </h3>
              </p>

              <hr />
              <p
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }}
              >
                <strong style={{ fontSize: '18px', color: '#008080' }}>News Image</strong>{' '}
                <img
                  src={dialogData.imageUrl}
                  alt="Job Image"
                  style={{ maxWidth: '500px', height: 'auto' }} // Adjust width and height as needed
                />
              </p>

              <hr />
            </>
          ) : dialogMode === 'editOrder' ? (
            <>
              <label
                htmlFor="Category Name"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder'
                }}
              >
                Category Name
              </label>
              <TextField
                margin="dense"
                label="Category Name"
                fullWidth
                variant="outlined"
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
              <br />
              <br />

              <label
                id="choose-client"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder'
                }}
              >
                Select Client
              </label>
              <br />
              <Select
                labelId="choose-client"
                fullWidth
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                label="Client"
                variant="outlined"
              >
                {jobs.map((item, index) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name || 'unnkown'}
                  </MenuItem>
                ))}
              </Select>

              <br />
              <br />
              <label
                htmlFor="Drive Link"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder'
                }}
              >
                Drive Link
              </label>
              <TextField
                margin="dense"
                label="Drive Link"
                fullWidth
                variant="outlined"
                type="text"
                value={deriveLink}
                onChange={(e) => setDeriveLink(e.target.value)}
                required
              />
              <br />
            </>
          ) : (
            <>
              <label
                for=" Name"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder'
                }}
              >
                Title
              </label>
              <TextField
                margin="dense"
                label="source"
                fullWidth
                variant="outlined"
                value={formValues.name}
                onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                required
              />
              <br />
              <br />
              <label
                for="pin"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder'
                }}
              >
                PIN
              </label>

              <TextField
                margin="dense"
                label="4-digit PIN (OTP)"
                type="number"
                fullWidth
                variant="outlined"
                inputProps={{ maxLength: 4 }}
                value={formValues.pin}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length <= 4) {
                    setFormValues((prev) => ({ ...prev, pin: val }));
                  }
                }}
              />

              <br />
              <br />
              <label
                for="url"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder'
                }}
              >
                URL
              </label>

              <TextField
                margin="dense"
                label="URL"
                type="text"
                fullWidth
                variant="outlined"
                value={formValues.url}
                onChange={(e) => setFormValues({ ...formValues, url: e.target.value })}
              />

              <br />
              <br />
              <label
                for=" Upload Image"
                style={{
                  fontSize: '15px',
                  color: '#008080',
                  fontWeight: 'bolder'
                }}
              >
                Upload Image
              </label>
              <br />

              <input type="file" accept="image/*" onChange={handleImageChange} required variant="outlined" />

              <br />
              <br />
              <TextField
                margin="dense"
                label="source"
                type="date"
                fullWidth
                variant="outlined"
                value={formValues.date}
                onChange={(e) => setFormValues({ ...formValues, date: e.target.value })}
                required
              />

              <br />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>

          {dialogMode !== 'view' && (
            <Button
              onClick={handleSubmit}
              color="primary"
              variant="contained"
              disabled={!formValues.name.trim()} // prevent empty submit
            >
              {dialogMode === 'add' ? 'Add' : 'Update'}
            </Button>
          )}
          {dialogMode == 'editOrder' && (
            <DeleteOutlined
              style={{
                cursor: 'pointer',
                fontSize: '20px',
                color: 'red',
                padding: '10px'
              }}
              onClick={() => handleCategoryDelete()}
            />
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

      <Dialog open={confirmCloseOpen}>
        <DialogTitle>Are you sure you want to close?</DialogTitle>
        <DialogActions>
          <Button onClick={() => handleConfirmClose(true)}>Yes</Button>
          <Button onClick={() => handleConfirmClose(false)}>No</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete News</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete the job titled "{dialogData.title}"?</Typography>
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
