import React from 'react';
import { Typography, Divider, Box } from '@mui/material';

const labelStyle = {
  fontSize: '16px',
  fontWeight: 600,
  color: '#006666',
  marginBottom: '4px'
};

const valueStyle = {
  fontSize: '18px',
  fontWeight: 500,
  color: '#222',
  margin: 0
};

const ViewClientModal = ({ dialogData }) => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* Name */}
      <Box>
        <Typography sx={labelStyle}>Name</Typography>
        <Typography sx={valueStyle}>{dialogData.name || '-'}</Typography>
      </Box>

      {/* Category */}
      <Box>
        <Typography sx={labelStyle}>Category</Typography>
        <Typography sx={valueStyle}>
          {dialogData.category && dialogData.category.length > 0
            ? dialogData.category.map((cat, index) => (
                <span key={cat._id}>
                  {cat.name}
                  {index < dialogData.category.length - 1 && ', '}
                </span>
              ))
            : '-'}
        </Typography>
      </Box>

      <Divider />

      {/* Image */}
      <Box>
        <Typography sx={labelStyle}>Banner Image</Typography>
        <Box
          component="img"
          src={dialogData.imageUrl}
          alt="Client Banner"
          sx={{ width: '100%', maxWidth: 400, borderRadius: 2, boxShadow: 2 }}
        />
      </Box>

      <Divider />
    </Box>
  );
};

export default ViewClientModal;