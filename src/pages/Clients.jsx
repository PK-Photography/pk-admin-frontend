import * as React from 'react';
import ViewClientModal from '../components/ViewClientModal';
import AddClientModal from '../components/AddClientModal';
import EditClientModal from '../components/EditClientModal';
import ClientTable from '../components/ClientTable';
import { useState, useEffect } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from '@mui/material';
import toast from 'react-hot-toast';
import axiosInstance from 'utils/axiosInstance';

export default function Clients() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // Delete confirmation dialog
  const [jobToDelete, setJobToDelete] = useState(null); // Job to delete
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const [pendingCloseAction, setPendingCloseAction] = useState(null);
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

      <ClientTable
        jobs={jobs}
        page={page}
        rowsPerPage={rowsPerPage}
        totalItems={totalItems}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleCanDownloadStatus={handleCanDownloadStatus}
        handleCanViewStatus={handleCanViewStatus}
        handleClickOpen={handleClickOpen}
        handleDeleteDialogOpen={handleDeleteDialogOpen}
      />

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
            <ViewClientModal dialogData={dialogData} />
          ) : dialogMode === 'editOrder' ? (
            <EditClientModal
              categoryName={categoryName}
              setCategoryName={setCategoryName}
              deriveLink={deriveLink}
              setDeriveLink={setDeriveLink}
              selectedClientId={selectedClientId}
              setSelectedClientId={setSelectedClientId}
              jobs={jobs}
            />
          ) : (
            <AddClientModal
              open={open}
              onClose={handleClose}
              onSubmit={handleSubmit}
              formValues={formValues}
              setFormValues={setFormValues}
            />
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
