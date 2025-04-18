import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  TablePagination
} from '@mui/material';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${TableCell.head}`]: {
    backgroundColor: '#5c899d',
    color: '#fffcef',
    fontWeight: 'bold',
    fontSize: '14px',
    textTransform: 'uppercase'
  },
  [`&.${TableCell.body}`]: {
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

const ClientTable = ({
  jobs,
  page,
  rowsPerPage,
  totalItems,
  handleChangePage,
  handleChangeRowsPerPage,
  handleCanDownloadStatus,
  handleCanViewStatus,
  handleClickOpen,
  handleDeleteDialogOpen
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Sr. No.</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
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
            <StyledTableRow key={job._id || index}>
              <StyledTableCell>{index + 1}</StyledTableCell>
              <StyledTableCell>
                {job.name.substring(0, 80)}
                {job.name.length > 80 && '...'}
              </StyledTableCell>
              <StyledTableCell>{job.pin}</StyledTableCell>
              <StyledTableCell>{job.url}</StyledTableCell>
              <StyledTableCell align="right">
                {job.category && job.category.length > 0
                  ? job.category.map((cat, i) => (
                      <span key={cat._id}>
                        {cat.name}
                        {i < job.category.length - 1 && ', '}
                      </span>
                    ))
                  : '-'}
                <EditOutlined
                  style={{ cursor: 'pointer', fontSize: '15px', color: 'blue', marginLeft: '5px' }}
                  onClick={() => handleClickOpen('editOrder', job)}
                />
              </StyledTableCell>
              <StyledTableCell align="right">
                {new Date(job.updatedAt).toLocaleDateString('en-US')}
              </StyledTableCell>
              <StyledTableCell align="right">
                <img
                  src={job.imageUrl}
                  alt="Job Image"
                  style={{ maxWidth: '100px', height: 'auto' }}
                />
              </StyledTableCell>
              <StyledTableCell align="right">
                <Switch checked={job.canDownload} onChange={() => handleCanDownloadStatus(job)} />
              </StyledTableCell>
              <StyledTableCell align="right">
                <Switch checked={job.canView} onChange={() => handleCanViewStatus(job)} />
              </StyledTableCell>
              <StyledTableCell align="right">
                <EyeOutlined
                  style={{ cursor: 'pointer', fontSize: '20px', color: 'green', marginRight: '8px' }}
                  onClick={() => handleClickOpen('view', job)}
                />
                <EditOutlined
                  style={{ cursor: 'pointer', fontSize: '20px', color: 'blue', marginRight: '8px' }}
                  onClick={() => handleClickOpen('edit', job)}
                />
                <DeleteOutlined
                  style={{ cursor: 'pointer', fontSize: '20px', color: 'red' }}
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
  );
};

export default ClientTable;