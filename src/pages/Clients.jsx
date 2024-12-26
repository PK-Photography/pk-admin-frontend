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
    CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";
import axiosInstance from "utils/axiosInstance";

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
    const [loading, setLoading] = useState(false);
    const [categoryName, setCategoryName] = useState(""); // New category name
    const [deriveLink, setDeriveLink] = useState(""); // New category image link
    const [selectedClientId, setSelectedClientId] = useState("");
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

    // const handleSubmit = async () => {
    //     try {

    //         if (dialogMode === "add") {
    //             const cardData = {
    //                 name: formValues.name,
    //                 date: formValues.date,
    //                 image: formValues.image, // Assuming the image will be converted to base64
    //             };

    //             try {
    //                 await axiosInstance.post("/upload", cardData);
    //                 toast.success("News Posted Successfully!🎉");
    //             } catch (error) {
    //                 console.error(error);
    //                 toast.error("Failed to post news. Please try again.");
    //             }
    //         }


    //         else if (dialogMode === "edit") {
    //             const cardData = {
    //                 name: formValues.name,
    //                 date: formValues.date,
    //                 image: formValues.image, // Assuming the image will be converted to base64
    //             };


    //             await axiosInstance.put(`/card/update/${dialogData._id}`, cardData, {
    //                 headers: { "Content-Type": "multipart/form-data" },
    //             });
    //             toast.success("News Edited Successfully!🖊️😍");
    //         } else if (dialogMode === "editOrder") {
    //             const updatedOrder = {
    //                 orderNumber: formValues.orderNumber,
    //             };

    //             await axiosInstance.put(`/news/order/${dialogData._id}`, updatedOrder, {
    //                 headers: { "Content-Type": "application/json" },
    //             });
    //             toast.success("Order updated Successfully!🖊️😍");
    //         }

    //         fetchNews(page, rowsPerPage); // Refresh the data
    //         handleClose();
    //     } catch (error) {
    //         console.error("Error submitting the form:", error);
    //         toast.error(`Error: ${error.response?.data?.message || "Unknown error"}`);
    //     }
    // };

    const handleSubmit = async () => {
        const loadingToast = toast.loading("Processing your request..."); // Show a loading toast
        try {
            if (dialogMode === "add") {
                const cardData = {
                    name: formValues.name,
                    date: formValues.date,
                    image: formValues.image, // Assuming the image will be converted to base64
                };

                try {
                    await axiosInstance.post("/upload", cardData);
                    toast.success("News Posted Successfully!🎉");
                } catch (error) {
                    console.error(error);
                    toast.error("Failed to post news. Please try again.");
                }
            } else if (dialogMode === "edit") {
                const cardData = {
                    name: formValues.name,
                    date: formValues.date,
                    image: formValues.image, // Assuming the image will be converted to base64
                };

                await axiosInstance.put(`/card/update/${dialogData._id}`, cardData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("News Edited Successfully!🖊️😍");
            } else if (dialogMode === "editOrder") {

                const newCategory = {
                    name: categoryName,
                    images: deriveLink,

                };
                await axiosInstance.put(
                    "/cards/update-category",
                    {
                        id: selectedClientId,
                        category: newCategory,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                toast.success("Category updated Successfully!🖊️😍");
            }

            fetchNews(page, rowsPerPage); // Refresh the data
            handleClose();
        } catch (error) {
            console.error("Error submitting the form:", error);
            toast.error(`Error: ${error.response?.data?.message || "Unknown error"}`);
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
                image: reader.result, // Set Base64 string
            }));
        };
        reader.readAsDataURL(file);
    };



    const handleDeleteDialogOpen = (job) => {
        setJobToDelete(job);
        setDeleteDialogOpen(true);
    };

    // const handleDelete = async () => {
    //     try {
    //         await axiosInstance.delete(`/cards/${jobToDelete._id}`);
    //         fetchNews(page, rowsPerPage);
    //         setDeleteDialogOpen(false);
    //         setJobToDelete(null);
    //         toast.success("Deleted Sucessfully🥲!");
    //     } catch (error) {
    //         console.error("Error deleting the job:", error);
    //         toast.error("Something went Wrong in deleting the job!😠");
    //     }
    // };


    const handleDelete = async () => {
        const loadingToast = toast.loading("Processing delete request...");
        setLoading(true);

        try {
            await axiosInstance.delete(`/cards/${jobToDelete._id}`);
            fetchNews(page, rowsPerPage);
            setDeleteDialogOpen(false);
            setJobToDelete(null);
            toast.success("Deleted Successfully🥲!"); // Show success toast after deletion
        } catch (error) {
            console.error("Error deleting the job:", error);
            toast.error("Something went wrong in deleting the job!😠"); // Show error toast if something goes wrong
        } finally {
            setLoading(false); // Set loading state to false after the request completes
            toast.dismiss(loadingToast); // Dismiss the loading toast once the operation is done
        }
    };

    const handleCategoryDelete = async () => {

    }


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




    return (
        <div>
            <h3
                style={{
                    textAlign: "right",
                }}
                onClick={() => handleClickOpen("add")}
            >
                <Button variant="contained"> Add New Client</Button>
            </h3>


            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Sr. No.</StyledTableCell>
                            <StyledTableCell>name</StyledTableCell>
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
                                    <EditOutlined
                                        style={{
                                            cursor: "pointer",
                                            fontSize: "15px",
                                            color: "blue",
                                            marginLeft: "5px",
                                        }}
                                        onClick={() => handleClickOpen("editOrder", job)}
                                    />

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
                                    <img
                                        src={job.imageUrl}
                                        alt="Job Image"
                                        style={{ maxWidth: '100px', height: 'auto' }} // Adjust width and height as needed
                                    />
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <Switch
                                        checked={job.isActive}
                                    // onChange={() => handleStatusSwitch(job)}
                                    />
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <Switch
                                        checked={job.isActive}
                                    // onChange={() => handleStatusSwitch(job)}
                                    />
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
                maxWidth="md "
                style={{ minWidth: "900px" }}

            >

                <DialogTitle>
                    {dialogMode === "add"
                        ? "Add Client"
                        : dialogMode === "edit"
                            ? "Edit Client"
                            : dialogMode === "editOrder"
                                ? "Edit Order"
                                : "Job Details"}
                </DialogTitle>

                <DialogContent style={{ minWidth: "500px" }}>
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
                                    src={dialogData.imageUrl}
                                    alt="Job Image"
                                    style={{ maxWidth: '500px', height: 'auto' }} // Adjust width and height as needed
                                />
                            </p>

                            <hr />
                        </>
                    ) : dialogMode === "editOrder" ? (
                        <>
                            <label
                                htmlFor="Category Name"
                                style={{
                                    fontSize: "15px",
                                    color: "#008080",
                                    fontWeight: "bolder",
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
                                // value={formValues.orderNumber}
                                // onChange={(e) =>
                                //     setFormValues({ ...formValues, orderNumber: e.target.value })
                                // }
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                required
                            />
                            <br />
                            <br />

                            <label
                                id="choose-client"
                                style={{
                                    fontSize: "15px",
                                    color: "#008080",
                                    fontWeight: "bolder",
                                }}
                            >
                                Select Client
                            </label>
                            <br />
                            {/* <Select
                                labelId="choose-client"
                                fullWidth
                                value={formValues.category}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, category: e.target.value })
                                }
                                label="Client"
                                variant="outlined"
                            >
                                {category.map((cat, index) => (
                                    <MenuItem key={index} value={cat}>
                                        {cat}
                                    </MenuItem>
                                ))}
                            </Select> */}
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
                                        {item.name || "unnkown"}
                                    </MenuItem>
                                ))}
                            </Select>


                            <br />
                            <br />
                            <label
                                htmlFor="Derive Link"
                                style={{
                                    fontSize: "15px",
                                    color: "#008080",
                                    fontWeight: "bolder",
                                }}
                            >
                                Derive Link
                            </label>
                            <TextField
                                margin="dense"
                                label="Derive Link"
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
                            {/* 👇👇 #################################👆👆 */}
                            <label
                                for=" Name"
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
                                value={formValues.name}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, name: e.target.value })
                                }
                                required
                            />
                            {/* 👇👇 #################################👆👆 */}
                            <br />

                            <br />
                            <label
                                for=" Upload Image"
                                style={{
                                    fontSize: "15px",
                                    color: "#008080",
                                    fontWeight: "bolder",
                                }}
                            >
                                Upload Image
                            </label>
                            <br />
                            {/* <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setFormValues({ ...formValues, image: e.target.files[0] })
                                } // Get file object
                                required
                            /> */}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                                variant="outlined"
                            />


                            <br />
                            <br />
                            <TextField
                                margin="dense"
                                label="source"
                                type="date"
                                fullWidth
                                variant="outlined"
                                value={formValues.date}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, date: e.target.value })
                                }
                                required
                            />

                            <br />


                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    {/* <Button onClick={handleCategoryDelete}>Delete</Button> */}

                    {dialogMode !== "view" && (
                        <Button onClick={handleSubmit} color="primary" variant="contained">
                            {dialogMode === "add" ? "Add" : "Update"}

                        </Button>
                    )}
                    {dialogMode == "editOrder" && (
                        <DeleteOutlined
                            style={{
                                cursor: "pointer",
                                fontSize: "20px",
                                color: "red",
                                padding: "10px"
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
                    {/* {loading && (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                            <CircularProgress />
                        </div>
                    )} */}

                </DialogActions>


            </Dialog>
        </div>
    );
}
