import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button, CircularProgress, Box, TextField, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import toast from 'react-hot-toast';
import axiosInstance from 'utils/axiosInstance';

const Gallary = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageName, setImageName] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [deleteImageId, setDeleteImageId] = useState(null);

    // Fetch all carousel images
    const fetchImages = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/gallery/all');
            setImages(response.data.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error('Error fetching images');
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    // Handle upload or update image
    const handleSave = async () => {
        if (!imageName || !subtitle || (!imageFile && !selectedImage)) {
            toast.error('Please provide all required fields');
            return;
        }

        const formData = new FormData();
        formData.append('imageName', imageName);
        formData.append('subtitle', subtitle);
        if (imageFile) formData.append('image', imageFile);

        let toastId;
        try {
            setLoading(true);
            toastId = toast.loading('Uploading image, please wait...');

            if (selectedImage) {
                await axiosInstance.put(`/gallery/update/${selectedImage.id}`, formData);
                toast.success('Image updated successfully', { id: toastId });
            } else {
                await axiosInstance.post('/gallery/upload', formData);
                toast.success('Image uploaded successfully', { id: toastId });
            }

            fetchImages();
            setOpen(false);
            setImagePreview('');
        } catch (error) {
            toast.error('Error saving image', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    // Handle delete image
    const handleDeleteConfirm = async () => {
        try {
            setLoading(true);
            await axiosInstance.delete(`/gallery/delete/${deleteImageId}`);
            toast.success('Image deleted successfully');
            fetchImages();
            setDeleteDialogOpen(false);
        } catch (error) {
            toast.error('Error deleting image');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { field: 'imageName', headerName: 'Image Name', width: 300 },
        { field: 'subtitle', headerName: 'Subtitle', width: 300 },
        {
            field: 'imageUrl',
            headerName: 'Image',
            width: 150,
            renderCell: (params) => (
                <img
                    src={params.value}
                    alt={params.row.imageName}
                    style={{ width: '100px', height: '50px', objectFit: 'cover' }}
                />
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => {
                            setSelectedImage(params.row);
                            setImageName(params.row.imageName);
                            setSubtitle(params.row.subtitle);
                            setImagePreview(params.row.imageUrl);
                            setOpen(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => {
                            setDeleteImageId(params.row.id);
                            setDeleteDialogOpen(true);
                        }}
                        style={{ marginLeft: 10 }}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Box padding={3}>
            <ToastContainer />

            <Button variant="contained" color="secondary" onClick={() => setOpen(true)} style={{ marginBottom: 16 }}>
                Add Image
            </Button>

            {loading ? (
                <CircularProgress />
            ) : (
                <div style={{ height: 500, width: '100%' }}>
                    <DataGrid
                        rows={images.map((img) => ({ ...img, id: img._id }))}
                        columns={columns}
                        pageSize={5}
                    />
                </div>
            )}

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{selectedImage ? 'Edit Image' : 'Add Image'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Image Name"
                        type="text"
                        fullWidth
                        value={imageName}
                        onChange={(e) => setImageName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Subtitle"
                        type="text"
                        fullWidth
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            setImageFile(e.target.files[0]);
                            setImagePreview(URL.createObjectURL(e.target.files[0]));
                        }}
                        style={{ marginTop: 16 }}
                    />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            style={{ width: '100%', height: '200px', marginTop: 16, objectFit: 'cover' }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this image?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Gallary;
