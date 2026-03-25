import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  CircularProgress
} from '@mui/material';
import toast from 'react-hot-toast';
import axiosInstance from 'utils/axiosInstance';
import { FaBan } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
const roles = ['Viewer', 'Writer', 'Client', 'Subscriber'];

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [openBan, setOpenBan] = useState(false);
  const [openRole, setOpenRole] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [banReason, setBanReason] = useState('');
  const [newRole, setNewRole] = useState('');
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const [newUser, setNewUser] = useState({
    fullName: '',
    mobileNo: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim()) {
        searchUsers(search);
      } else {
        fetchUsers();
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  const searchUsers = async (query) => {
    try {
      setSearchLoading(true);

      const res = await axiosInstance.get(`/user/search?q=${query}`);
      setUsers(res.data.data);
    } catch (error) {
      toast.error('Error searching users');
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/user/all');
      setUsers(response.data);
    } catch (error) {
      toast.error('Error fetching users');
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const handleCreateUser = async () => {
    try {
      setCreateLoading(true);

      const response = await axiosInstance.post('/user/signup', newUser);

      if (response.status === 200) {
        toast.error('User already exists with provided mobile number.');
        return;
      }

      if (response.status === 201) {
        toast.success('User created successfully');

        setUsers((prev) => [...prev, response.data.data.user]);

        setOpenCreate(false);

        setNewUser({
          fullName: '',
          mobileNo: '',
          email: '',
          password: ''
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error creating user');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleRoleChange = (user, role) => {
    setSelectedUser(user);
    setNewRole(role);
    setOpenRole(true);
  };

  const handleViewFavourites = (user) => {
    navigate('/favourites', { state: { favourites: user.favourite } });
  };

  const confirmRoleChange = async () => {
    if (!selectedUser || !newRole) return;
    try {
      await axiosInstance.put('/user/update-role', {
        userId: selectedUser.id,
        role: newRole
      });
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === selectedUser.id ? { ...user, role: newRole } : user)));
      toast.success('User role updated successfully');
      setOpenRole(false);
    } catch (error) {
      toast.error('Error updating role');
    }
  };

  const handleOpenBanDialog = (user) => {
    setSelectedUser(user);
    setBanReason('');
    setOpenBan(true);
  };

  const handleCloseBanDialog = () => {
    setOpenBan(false);
    setSelectedUser(null);
  };

  const handleBanUser = async () => {
    try {
      await axiosInstance.put('/user/ban', { userId: selectedUser.id, reason: banReason });
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === selectedUser.id ? { ...user, isBan: true } : user)));
      toast.success('User banned successfully');
      handleCloseBanDialog();
    } catch (error) {
      toast.error('Error banning user');
    }
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <TextField
          placeholder="Search by name, email, or ID..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '300px' }}
        />

        <Button variant="contained" color="primary" onClick={() => setOpenCreate(true)}>
          + Create User
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: '#1a75ba', color: '#fff' }}>
            <TableRow style={{ color: '#fff' }}>
              <TableCell style={{ color: '#fff' }}>Name</TableCell>
              <TableCell style={{ color: '#fff' }}>Email</TableCell>
              <TableCell style={{ color: '#fff' }}>Phone</TableCell>
              <TableCell style={{ color: '#fff' }}>isverify</TableCell>
              <TableCell style={{ color: '#fff' }}>Joined at</TableCell>
              <TableCell style={{ color: '#fff' }}>Role</TableCell>
              <TableCell style={{ color: '#fff' }}>View Favourites</TableCell>
              <TableCell style={{ color: 'red' }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          {loading || searchLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <CircularProgress />
            </div>
          ) : (
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.fullName || user.name || '-'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.mobileNo || '-'}</TableCell>
                  <TableCell>{user.isverify ? 'YES' : 'NO' || '-'}</TableCell>
                  <TableCell>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',

                          hour12: true
                        })
                      : '-'}
                  </TableCell>

                  <TableCell>
                    <Select value={user.role} onChange={(e) => handleRoleChange(user, e.target.value)}>
                      {roles.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>

                  <TableCell>
                    <Button variant="outlined" color="primary" onClick={() => handleViewFavourites(user)}>
                      View
                    </Button>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="h6"
                      onClick={() => handleOpenBanDialog(user)}
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'red', cursor: 'pointer' }}
                    >
                      <FaBan style={{ fontSize: '15px' }} /> Ban user
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>

        {/* Role Change Dialog */}
        <Dialog open={openRole} onClose={() => setOpenRole(false)}>
          <DialogTitle>Confirm Role Change</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to change the role of {selectedUser?.fullName || selectedUser?.name} to {newRole}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRole(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmRoleChange} color="secondary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Ban User Dialog */}
        <Dialog open={openBan} onClose={handleCloseBanDialog}>
          <DialogTitle>Ban User</DialogTitle>
          <DialogContent>
            <DialogContentText>Enter the reason for banning {selectedUser?.fullName || selectedUser?.name}:</DialogContentText>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseBanDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBanUser} color="secondary" disabled={!banReason.trim()}>
              Ban
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create User Dialog */}
        <Dialog
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          maxWidth="sm" // xs | sm | md | lg | xl
          fullWidth
        >
          <DialogTitle>Create New User</DialogTitle>

          <DialogContent dividers>
            <TextField
              label="Full Name"
              placeholder="Enter full name"
              fullWidth
              margin="normal"
              variant="outlined"
              value={newUser.fullName}
              onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
            />

            <TextField
              label="Mobile Number"
              placeholder="Enter mobile number"
              fullWidth
              margin="normal"
              variant="outlined"
              value={newUser.mobileNo}
              onChange={(e) => setNewUser({ ...newUser, mobileNo: e.target.value })}
            />

            <TextField
              label="Email (Optional)"
              placeholder="Enter email"
              fullWidth
              margin="normal"
              variant="outlined"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />

            <TextField
              label="Password (Optional)"
              type="password"
              placeholder="Minimum 6 characters"
              fullWidth
              margin="normal"
              variant="outlined"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
          </DialogContent>

          <DialogActions sx={{ padding: '16px' }}>
            <Button onClick={() => setOpenCreate(false)}>Cancel</Button>

            <Button
              onClick={handleCreateUser}
              variant="contained"
              disabled={createLoading || !newUser.fullName.trim() || newUser.mobileNo.trim().length !== 10}
            >
              {createLoading ? <CircularProgress size={20} /> : 'Create User'}
            </Button>
          </DialogActions>
        </Dialog>
      </TableContainer>
    </>
  );
}
