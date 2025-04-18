// components/AddClientModal.js
import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField
} from '@mui/material';

const AddClientModal = ({ open, onClose, onSubmit, formValues, setFormValues }) => {
  const handleInputChange = (field) => (e) => {
    setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" style={{ minWidth: '900px' }}>
      <DialogTitle>Add Client</DialogTitle>
      <DialogContent style={{ minWidth: '500px' }}>
        <label style={{ fontSize: '15px', color: '#008080', fontWeight: 'bolder' }}>Title</label>
        <TextField
          margin="dense"
          label="Source"
          fullWidth
          variant="outlined"
          value={formValues.name}
          onChange={handleInputChange('name')}
          required
        />

        <br /><br />
        <label style={{ fontSize: '15px', color: '#008080', fontWeight: 'bolder' }}>PIN</label>
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

        <br /><br />
        <label style={{ fontSize: '15px', color: '#008080', fontWeight: 'bolder' }}>URL</label>
        <TextField
          margin="dense"
          label="URL"
          type="text"
          fullWidth
          variant="outlined"
          value={formValues.url}
          onChange={handleInputChange('url')}
        />

        <br /><br />
        <label style={{ fontSize: '15px', color: '#008080', fontWeight: 'bolder' }}>Upload Image</label>
        <br />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > 10 * 1024 * 1024) {
              alert('File size exceeds 10MB. Please upload a smaller file.');
              return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
              setFormValues((prev) => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
          }}
          required
        />

        <br /><br />
        <label style={{ fontSize: '15px', color: '#008080', fontWeight: 'bolder' }}>Date</label>
        <br/>
        <TextField
          margin="dense"
          type="date"
          fullWidth
          variant="outlined"
          value={formValues.date}
          onChange={handleInputChange('date')}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onSubmit}
          color="primary"
          variant="contained"
          disabled={!formValues.name.trim()}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddClientModal;
