import React, { useEffect } from 'react';
import { TextField, IconButton, Button } from '@mui/material';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

export default function EditClientModal({
  categoryList,
  setCategoryList,
  selectedClientId,
  setSelectedClientId,
  jobs
}) {
  useEffect(() => {
    console.log('🟠 selectedClientId:', selectedClientId);
  }, [categoryList]);

  const handleChange = (index, field, value) => {
    const updated = [...categoryList];
    updated[index][field] = value;
    setCategoryList(updated);
  };

  const handleAddCategory = () => {
    setCategoryList([...categoryList, { name: '', images: '' }]);
  };

  const handleRemoveCategory = async (index, categoryId) => {
    if (categoryId) {
      await onDeleteCategory(categoryId); // Call API to delete
    } else {
      // If not saved yet, just remove locally
      const updated = [...categoryList];
      updated.splice(index, 1);
      setCategoryList(updated);
    }
  };

  return (
    <>
      <label style={{ fontSize: '15px', color: '#008080', fontWeight: 'bolder' }}>Select Client</label>
      <br />
      <select
        style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
        value={selectedClientId}
        onChange={(e) => setSelectedClientId(e.target.value)}
      >
        <option value="">-- Select Client --</option>
        {jobs.map((item) => (
          <option key={item._id} value={item._id}>
            {item.name || 'Unknown'}
          </option>
        ))}
      </select>

      {categoryList.map((cat, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <TextField
            fullWidth
            label="Category Name"
            value={cat.name}
            onChange={(e) => handleChange(index, 'name', e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            label="Image Source"
            value={cat.images}
            onChange={(e) => handleChange(index, 'images', e.target.value)}
          />
          <IconButton onClick={() => handleRemoveCategory(index)} style={{ marginTop: '10px' }}>
            <DeleteOutlined style={{ color: 'red' }} />
          </IconButton>
        </div>
      ))}

      <Button
        variant="outlined"
        color="primary"
        onClick={handleAddCategory}
        startIcon={<PlusOutlined />}
      >
        Add Category
      </Button>
    </>
  );
}