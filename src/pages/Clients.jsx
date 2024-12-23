import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useState, useEffect } from "react";
import Switch from "@mui/material/Switch";
import TablePagination from "@mui/material/TablePagination";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

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
} from "@mui/material";
import toast from "react-hot-toast";
import axiosInstance from "utils/axiosInstance";
import { date } from "yup";

const label = { inputProps: { "aria-label": "Switch demo" } };

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#008080",
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

export default function Clients() {
    const [jobs, setJobs] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [open, setOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add"); // 'add', 'edit', 'view'
    const [dialogData, setDialogData] = useState({});
    const [formValues, setFormValues] = useState({
        name: "",
        date: "",

        imageUrl: null,

        category: "",
        date: ""

    });
    const [alertOpen, setAlertOpen] = useState(false); // Alert for isMarquee
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // Delete confirmation dialog
    const [jobToDelete, setJobToDelete] = useState(null); // Job to delete
    const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
    const [pendingCloseAction, setPendingCloseAction] = useState(null);
    const [orderNo, setOrderNo] = useState(null);

    useEffect(() => {
        fetchNews(page, rowsPerPage);
    }, [page, rowsPerPage]);

    const fetchNews = (page, rowsPerPage) => {
        axiosInstance
            .get(`/cards`)
            .then((response) => {
                const newsData = response.data;
                // const pagination = response.data.data.pagination;
                setJobs(newsData);
                // setTotalItems(pagination.totalItems);
                // setTotalPages(pagination.totalPages);
                // console.log(newsData)
            })
            .catch((error) => {
                console.error("Error fetching the jobs:", error);
                toast.error("Something went Wrong in job fetching!😠");
            });
    };

    const handleChangePage = (event, newPage) => {
        toast.success("Page Changed!🌈");

        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page on changing rows per page
    };

    const handleClickOpen = (mode, job = {}) => {
        const loadingToastId = toast.loading("🖐️Hold on 🎁 Loading...", {
            style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
            },
        });

        setDialogMode(mode);
        setDialogData(job);

        setTimeout(() => {
            setFormValues({
                name: job.name || "",
                date: job.date || "",
                imageUrl: job.image || null,
                category: job.category || "",
                date: job.date || ""
            });

            toast.dismiss(loadingToastId);
            setOpen(true);
        }, 100);
    };

    const handleClose = (action = null) => {
        if (action === "confirm") {
            setOpen(false); // Close the dialog if confirmed
        } else {
            setPendingCloseAction(action); // Store the action (outside click or cancel)
            setConfirmCloseOpen(true); // Open the confirmation dialog
        }
    };

    // For cancel button:
    const handleClickCancel = () => {
        handleClose("cancel");
    };

    const handleConfirmClose = (confirm) => {
        if (confirm) {
            setOpen(false); // Close if user confirms
        }
        setConfirmCloseOpen(false); // Close the confirmation dialog
    };

    const handleSubmit = async () => {
        try {
            if (dialogMode === "add") {
                const formData = new FormData();
                formData.append("title", formValues.title);
                formData.append("description", formValues.description);
                formData.append("appDescription", formValues.appDescription);
                formData.append("image", formValues.image); // Append the image file
                formData.append("url", formValues.url);
                formData.append("category", formValues.category || "others");
                formData.append("source", formValues.source);
                formData.append("isMarquee", formValues.isMarquee);
                formData.append("isActive", formValues.isActive);
                formData.append("orderNumber", formValues.orderNumber);

                await axiosInstance.post("/news/create", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                toast.success("News Posted Successfully!🎉");
            } else if (dialogMode === "edit") {
                const formData = new FormData();
                formData.append("title", formValues.title);
                formData.append("description", formValues.description);
                formData.append("appDescription", formValues.appDescription);
                formData.append("image", formValues.image);
                formData.append("url", formValues.url);
                formData.append("category", formValues.category || "others");
                formData.append("source", formValues.source);
                formData.append("isMarquee", formValues.isMarquee);
                formData.append("isActive", formValues.isActive);
                formData.append("orderNumber", formValues.orderNumber);

                await axiosInstance.put(`/news/${dialogData._id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("News Edited Successfully!🖊️😍");
            } else if (dialogMode === "editOrder") {
                const updatedOrder = {
                    orderNumber: formValues.orderNumber,
                };

                await axiosInstance.put(`/news/order/${dialogData._id}`, updatedOrder, {
                    headers: { "Content-Type": "application/json" },
                });
                toast.success("Order updated Successfully!🖊️😍");
            }

            fetchNews(page, rowsPerPage); // Refresh the data
            handleClose();
        } catch (error) {
            console.error("Error submitting the form:", error);
            toast.error(`Error: ${error.response?.data?.message || "Unknown error"}`);
        }
    };

    const handleDeleteDialogOpen = (job) => {
        setJobToDelete(job);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`/news/${jobToDelete._id}`);
            fetchNews(page, rowsPerPage);
            setDeleteDialogOpen(false);
            setJobToDelete(null);
            toast.success("Deleted Sucessfully🥲!");
        } catch (error) {
            console.error("Error deleting the job:", error);
            toast.error("Something went Wrong in deleting the job!😠");
        }
    };

    const handleMarqueeSwitch = (job) => {
        const activeMarqueeCount = jobs.filter((j) => j.isMarquee).length;

        // Check if we're trying to activate a marquee while the max (5) are already active
        if (!job.isMarquee && activeMarqueeCount >= 5) {
            toast.error("Can't turn on more than 5 Marquees!😠");
            setAlertOpen(true);
        } else {
            const updatedJob = {
                ...job,
                isMarquee: !job.isMarquee, // Toggle the marquee status
            };

            toast.success("Marquee Status Updated!🤔");

            // Send the update request to the backend
            axiosInstance
                .put(`/news/${job._id}`, updatedJob)
                .then(() => {
                    fetchNews(page, rowsPerPage); // Refresh the news data
                })
                .catch((error) => {
                    console.error("Error updating marquee status:", error);
                    toast.error("Error updating marquee status!😠");
                });
        }
    };

    // ============================|| Handle description chamge ||=================
    const maxChars = 700;

    const handleDescriptionChange = (e) => {
        const { value } = e.target;
        if (value.length <= maxChars) {
            setFormValues({
                ...formValues,
                appDescription: value,
            });
        }
    };

    const charCount = formValues.appDescription
        ? formValues.appDescription.length
        : 0;
    const isMaxLimitReached = charCount === maxChars;

    // ################### Array of News Categories #############
    const category = [
        "education",
        "career",
        "tech",
        "entertainment",
        "health",
        "sports",
        "politics",
        "current-affairs-and-gk",
        "others",
    ];

    //Editor config
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ align: [] }],
            ["link", "image"],
            [{ color: [] }, { background: [] }],
            ["clean"],
            ["table"], // Add table support
        ],
    };

    const formats = [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "indent",
        "align",
        "link",
        "image",
        "color",
        "background",
        "table", // Add table and color formats
    ];


    console.log(jobs)

    return (
        <div>
            <h3
                style={{
                    textAlign: "right",
                }}
                onClick={() => handleClickOpen("add")}
            >
                <Button variant="contained"> Add New News</Button>
            </h3>

            {alertOpen && (
                <Alert
                    severity="warning"
                    onClose={() => setAlertOpen(false)}
                    style={{ marginBottom: "10px" }}
                >
                    You can't add more than 5 Marquee Active jobs!
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Sr. No.</StyledTableCell>
                            <StyledTableCell>name</StyledTableCell>
                            <StyledTableCell align="right">Category</StyledTableCell>
                            <StyledTableCell align="right">Date</StyledTableCell>
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
                                    {job.name.length > 80 && "..."}
                                </StyledTableCell>

                                <StyledTableCell align="right">
                                    {job.category && job.category.length > 0
                                        ? job.category.map((cat, index) => (
                                            <span key={cat._id}>
                                                {cat.name}
                                                {index < job.category.length - 1 && ", "}
                                            </span>
                                        ))
                                        : "-"}
                                </StyledTableCell>

                                <StyledTableCell align="right">
                                    {/* {job.date || "-"} */}
                                    {new Date(job.updatedAt).toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",

                                    })}
                                </StyledTableCell>

                                <StyledTableCell align="right">
                                    <EyeOutlined
                                        style={{
                                            cursor: "pointer",
                                            fontSize: "20px",
                                            color: "green",
                                            marginRight: "8px",
                                        }}
                                        onClick={() => handleClickOpen("view", job)}
                                    />
                                    <EditOutlined
                                        style={{
                                            cursor: "pointer",
                                            fontSize: "20px",
                                            color: "blue",
                                            marginRight: "8px",
                                        }}
                                        onClick={() => handleClickOpen("edit", job)}
                                    />
                                    <DeleteOutlined
                                        style={{
                                            cursor: "pointer",
                                            fontSize: "20px",
                                            color: "red",
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
                onClose={() => handleClose("outsideClick")} // Instead of directly closing
                disableBackdropClick
                maxWidth="md"
            >

                <DialogTitle>
                    {dialogMode === "add"
                        ? "Add Job"
                        : dialogMode === "edit"
                            ? "Edit Job"
                            : dialogMode === "editOrder"
                                ? "Edit Order"
                                : "Job Details"}
                </DialogTitle>

                <DialogContent>
                    {dialogMode === "view" ? (
                        <>
                            <p>
                                <strong style={{ fontSize: "18px", color: "#008080" }}>
                                    Name
                                </strong>{" "}
                                <h3> {dialogData.name}</h3>
                            </p>
                            <p>
                                <strong style={{ fontSize: "18px", color: "#008080" }}>
                                    Category
                                </strong>{" "}
                                {/* <h3> {dialogData.category || "No Caregory "} */}
                                <h3>
                                    {dialogData.category && dialogData.category.length > 0
                                        ? dialogData.category.map((cat, index) => (
                                            <span key={cat._id}>
                                                {cat.name}
                                                {index < dialogData.category.length - 1 && ", "}
                                            </span>
                                        ))
                                        : "-"}
                                </h3>
                            </p>

                            <hr />
                            <p
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "5px",
                                }}
                            >
                                <strong style={{ fontSize: "18px", color: "#008080" }}>
                                    News Image
                                </strong>{" "}
                                <img
                                    src={dialogData.image}
                                    alt={dialogData.title}
                                    height={300}
                                    width={500}
                                />
                            </p>

                            <hr />
                        </>
                    ) : dialogMode === "editOrder" ? (
                        {/* <>
                            <label
                                htmlFor="orderNumber"
                                style={{
                                    fontSize: "15px",
                                    color: "#008080",
                                    fontWeight: "bolder",
                                }}
                            >
                                Order Number
                            </label>
                            <TextField
                                margin="dense"
                                label="Order Number"
                                fullWidth
                                variant="outlined"
                                type="number"
                                value={formValues.orderNumber}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, orderNumber: e.target.value })
                                }
                                required
                            />
                        </> */}

                    ) : (
                        <>
                            {/* 👇👇 #################################👆👆 */}
                            <label
                                for=" Title"
                                style={{
                                    fontSize: "15px",
                                    color: "#008080",
                                    fontWeight: "bolder",
                                }}
                            >
                                Title
                            </label>
                            <TextField
                                margin="dense"
                                label="source"
                                fullWidth
                                variant="outlined"
                                value={formValues.title}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, title: e.target.value })
                                }
                                required
                            />
                            {/* 👇👇 #################################👆👆 */}
                            <br />
                            {/* 👇👇 #################################👆👆 */}

                            <label
                                id="category-label"
                                style={{
                                    fontSize: "15px",
                                    color: "#008080",
                                    fontWeight: "bolder",
                                }}
                            >
                                Category
                            </label>
                            <br />
                            <Select
                                labelId="category-label"
                                fullWidth
                                value={formValues.category}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, category: e.target.value })
                                }
                                label="Category"
                                variant="outlined"
                            >
                                {category.map((cat, index) => (
                                    <MenuItem key={index} value={cat}>
                                        {cat}
                                    </MenuItem>
                                ))}
                            </Select>

                            {/* 👇👇 #################################👆👆 */}
                            <br />
                            <label
                                for="Job Title"
                                style={{
                                    fontSize: "15px",
                                    color: "#008080",
                                    fontWeight: "bolder",
                                }}
                            >
                                Source
                            </label>
                            <TextField
                                margin="dense"
                                label="Job Title"
                                fullWidth
                                variant="outlined"
                                value={formValues.source}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, source: e.target.value })
                                }
                                required
                            />
                            {/* 👇👇 #################################👆👆 */}
                            {/* 👇👇 #################################👆👆 */}
                            <label
                                for="url"
                                style={{
                                    fontSize: "15px",
                                    color: "#008080",
                                    fontWeight: "bolder",
                                }}
                            >
                                URL
                            </label>
                            <TextField
                                margin="dense"
                                label="URL"
                                fullWidth
                                variant="outlined"
                                value={formValues.url}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, url: e.target.value })
                                }
                                required
                            />
                            {/* 👇👇 #################################👆👆 */}
                            <label
                                for="Description"
                                style={{
                                    fontSize: "15px",
                                    color: "#008080",
                                    fontWeight: "bolder",
                                }}
                            >
                                Description
                            </label>
                            <ReactQuill
                                theme="snow"
                                value={formValues.description}
                                onChange={(description) =>
                                    setFormValues({
                                        ...formValues,
                                        description,
                                    })
                                }
                                modules={modules}
                                formats={formats}
                                style={{ height: "auto" }}
                            />
                            <br />
                            {/* 👇👇 #################################👆👆 */}
                            <div style={{ position: "relative", marginBottom: "20px" }}>
                                <label
                                    htmlFor="appDescription"
                                    style={{
                                        fontSize: "15px",
                                        color: "#008080",
                                        fontWeight: "bolder",
                                    }}
                                >
                                    App Description
                                </label>
                                <textarea
                                    id="appDescription"
                                    name="appDescription"
                                    rows="4"
                                    maxLength={maxChars}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        borderRadius: "4px",
                                        border: isMaxLimitReached
                                            ? "2px solid red"
                                            : "1px solid #c4c4c4",
                                        fontSize: "16px",
                                        outlineColor: "#008080",
                                        resize: "none",
                                    }}
                                    value={formValues.appDescription}
                                    onChange={handleDescriptionChange}
                                    required
                                />
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: "8px",
                                        right: "10px",
                                        fontSize: "12px",
                                        color: isMaxLimitReached ? "red" : "#008080",
                                    }}
                                >
                                    {charCount}/{maxChars}
                                </div>
                            </div>
                            {/* 👇👇 #################################👆👆 */}
                            <br />
                            <br />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setFormValues({ ...formValues, image: e.target.files[0] })
                                } // Get file object
                                required
                            />

                            <br />


                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    {dialogMode !== "view" && (
                        <Button onClick={handleSubmit} color="primary" variant="contained">
                            {dialogMode === "add" ? "Add" : "Update"}
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
            {/* ===================== || edit order number dialog ||=================== */}

            <Dialog open={confirmCloseOpen}>
                <DialogTitle>Are you sure you want to close?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => handleConfirmClose(true)}>Yes</Button>
                    <Button onClick={() => handleConfirmClose(false)}>No</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Delete News</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the job titled "{dialogData.title}"?
                    </Typography>
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
