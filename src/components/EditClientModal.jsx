import React, { useEffect } from 'react';
import { TextField, Select, MenuItem } from '@mui/material';

export default function EditClientModal({
  categoryName,
  setCategoryName,
  deriveLink,
  setDeriveLink,
  selectedClientId,
  setSelectedClientId,
  jobs
}) {
  // Debug logs to inspect received props
  useEffect(() => {
    console.log('💡 EditClientModal mounted');
    console.log('🟡 categoryName:', categoryName);
    console.log('🟢 deriveLink:', deriveLink);
    console.log('🔵 selectedClientId:', selectedClientId);
    console.log('🟠 jobs:', jobs);
  }, [categoryName, deriveLink, selectedClientId, jobs]);

  return (
    <>
      <label
        htmlFor="Category Name"
        style={{ fontSize: '15px', color: '#008080', fontWeight: 'bolder' }}
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
        onChange={(e) => {
          console.log('✏️ Category Changed:', e.target.value);
          setCategoryName(e.target.value);
        }}
        required
      />
      <br />
      <br />

      <label
        id="choose-client"
        style={{ fontSize: '15px', color: '#008080', fontWeight: 'bolder' }}
      >
        Select Client
      </label>
      <br />
      <Select
        labelId="choose-client"
        fullWidth
        value={selectedClientId}
        onChange={(e) => {
          console.log('✅ Client Selected:', e.target.value);
          setSelectedClientId(e.target.value);
        }}
        label="Client"
        variant="outlined"
      >
        {jobs.map((item) => (
          <MenuItem key={item._id} value={item._id}>
            {item.name || 'Unknown'}
          </MenuItem>
        ))}
      </Select>
      <br />
      <br />
      <label
        htmlFor="Drive Link"
        style={{ fontSize: '15px', color: '#008080', fontWeight: 'bolder' }}
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
        onChange={(e) => {
          console.log('🔗 Drive Link Changed:', e.target.value);
          setDeriveLink(e.target.value);
        }}
        required
      />
    </>
  );
}