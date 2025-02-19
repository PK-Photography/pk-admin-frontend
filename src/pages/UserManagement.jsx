import { useEffect, useState } from "react";
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
    CircularProgress,
} from "@mui/material";
import toast from 'react-hot-toast';
import axiosInstance from "utils/axiosInstance";
import { FaBan } from "react-icons/fa6";
const roles = ["Viewer", "Writer", "Client", "Subscriber"];

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [openBan, setOpenBan] = useState(false);
    const [openRole, setOpenRole] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [banReason, setBanReason] = useState("");
    const [newRole, setNewRole] = useState("");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get("/user/all");
            setUsers(response.data);
        } catch (error) {
            toast.error("Error fetching users");
        }
        finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    const handleRoleChange = (user, role) => {
        setSelectedUser(user);
        setNewRole(role);
        setOpenRole(true);
    };

    const confirmRoleChange = async () => {
        if (!selectedUser || !newRole) return;
        try {
            await axiosInstance.put("/user/update-role", {
                userId: selectedUser.id,
                role: newRole,
            });
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === selectedUser.id ? { ...user, role: newRole } : user
                )
            );
            toast.success("User role updated successfully");
            setOpenRole(false);
        } catch (error) {
            toast.error("Error updating role");
        }
    };

    const handleOpenBanDialog = (user) => {
        setSelectedUser(user);
        setBanReason("");
        setOpenBan(true);
    };

    const handleCloseBanDialog = () => {
        setOpenBan(false);
        setSelectedUser(null);
    };

    const handleBanUser = async () => {
        try {
            await axiosInstance.put("/user/ban", { userId: selectedUser.id, reason: banReason });
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === selectedUser.id ? { ...user, isBan: true } : user
                )
            );
            toast.success("User banned successfully");
            handleCloseBanDialog();
        } catch (error) {
            toast.error("Error banning user");
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead style={{ backgroundColor: "#1a75ba", color: "#fff" }}>
                    <TableRow style={{ color: "#fff" }}>
                        <TableCell style={{ color: "#fff" }}>Name</TableCell>
                        <TableCell style={{ color: "#fff" }}>Email</TableCell>
                        <TableCell style={{ color: "#fff" }}>Phone</TableCell>
                        <TableCell style={{ color: "#fff" }}>isverify</TableCell>
                        <TableCell style={{ color: "#fff" }}>Joined at</TableCell>
                        <TableCell style={{ color: "#fff" }}>Role</TableCell>
                        <TableCell style={{ color: "red" }}>Actions</TableCell>
                    </TableRow>
                </TableHead>

                {loading ? (

                    <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                        <CircularProgress />
                    </div>
                ) : (

                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.fullName || user.name || "-"}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.mobileNo || "-"}</TableCell>
                                <TableCell>{user.isverify ? "YES" : "NO" || "-"}</TableCell>
                                <TableCell>
                                    {user.createdAt
                                        ? new Date(user.createdAt).toLocaleString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",

                                            hour12: true,
                                        })
                                        : "-"}
                                </TableCell>

                                <TableCell>
                                    <Select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user, e.target.value)}
                                    >
                                        {roles.map((role) => (
                                            <MenuItem key={role} value={role}>
                                                {role}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="h6" onClick={() => handleOpenBanDialog(user)} style={{ display: "flex", alignItems: "center", gap: "5px", color: "red", cursor: "pointer" }}>
                                        <FaBan style={{ fontSize: "15px", }} /> Ban user
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
                    <Button onClick={() => setOpenRole(false)} color="primary">Cancel</Button>
                    <Button onClick={confirmRoleChange} color="secondary">Confirm</Button>
                </DialogActions>
            </Dialog>

            {/* Ban User Dialog */}
            <Dialog open={openBan} onClose={handleCloseBanDialog}>
                <DialogTitle>Ban User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the reason for banning {selectedUser?.fullName || selectedUser?.name}:
                    </DialogContentText>
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
                    <Button onClick={handleCloseBanDialog} color="primary">Cancel</Button>
                    <Button onClick={handleBanUser} color="secondary" disabled={!banReason.trim()}>
                        Ban
                    </Button>
                </DialogActions>
            </Dialog>
        </TableContainer>
    );
}
