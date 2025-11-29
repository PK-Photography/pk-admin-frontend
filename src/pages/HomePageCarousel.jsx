import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  CircularProgress,
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import toast from 'react-hot-toast';
import axiosInstance from 'utils/axiosInstance';

const HomePageCarousel = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageType, setImageType] = useState('Desktop');
  const [videoUrl, setVideoUrl] = useState('');
  const [deleteImageId, setDeleteImageId] = useState(null);

  // Fetch all carousel images
  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/carousel/all');
      setImages(response.data.data);
    } catch (error) {
      toast.error('Error fetching images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const resetForm = () => {
    setSelectedImage(null);
    setImageName('');
    setImageFile(null);
    setImagePreview('');
    setImageType('Desktop');
    setVideoUrl('');
  };

  const handleSave = async () => {
    // Validation: require at least one of image file / videoUrl when creating
    const editingHasExistingAsset =
      selectedImage &&
      (selectedImage.imageUrl || selectedImage.videoUrl);

    if (!imageName) {
      toast.error('Please provide image name');
      return;
    }

    if (!imageFile && !videoUrl && !editingHasExistingAsset) {
      toast.error('Please provide an image file or a video URL.');
      return;
    }

    const formData = new FormData();
    formData.append('imageName', imageName);
    formData.append('imageType', imageType);
    if (imageFile) formData.append('image', imageFile);
    if (videoUrl) formData.append('videoUrl', videoUrl);

    let toastId;
    try {
      setLoading(true);
      toastId = toast.loading('Uploading image, please wait...');

      if (selectedImage) {
        // Update (PUT)
        await axiosInstance.put(`/carousel/update/${selectedImage._id}`, formData);
        toast.success('Image updated successfully', { id: toastId });
      } else {
        // Create (POST)
        await axiosInstance.post('/carousel/upload', formData);
        toast.success('Image uploaded successfully', { id: toastId });
      }

      await fetchImages();
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Error saving image', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // Handle delete image
  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/carousel/delete/${deleteImageId}`);
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
    { field: 'imageName', headerName: 'Image Name', width: 400 },
    {
      field: 'imageUrl',
      headerName: 'Image',
      width: 180,
      renderCell: (params) => {
        const url = params.value;
        if (!url) return <span style={{ color: '#777' }}>—</span>;
        return (
          <img
            src={url}
            alt={params.row.imageName}
            style={{ width: '120px', height: '60px', objectFit: 'cover', borderRadius: 6 }}
          />
        );
      },
    },
    {
      field: 'videoUrl',
      headerName: 'Video',
      width: 220,
      renderCell: (params) => {
        const v = params.value;
        if (!v) return <span style={{ color: '#777' }}>—</span>;
        return (
          <a href={v} target="_blank" rel="noreferrer" style={{ color: '#1e90ff', textDecoration: 'underline' }}>
            Open video
          </a>
        );
      },
    },
    {
      field: 'imageType',
      headerName: 'Image Type',
      width: 180,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 220,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => {
              const row = params.row;
              setSelectedImage(row);
              setImageName(row.imageName || '');
              setImagePreview(row.imageUrl || '');
              setImageType(row.imageType || 'Desktop');
              setVideoUrl(row.videoUrl || '');
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
              setDeleteImageId(params.row._id);
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
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          resetForm();
          setOpen(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Add Image / Video
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={images.map((img) => ({ ...img, id: img._id }))}
            columns={columns}
            pageSize={8}
            rowsPerPageOptions={[8, 20, 50]}
            sx={{
              '& .MuiDataGrid-row': {
                marginBottom: 2,
              },
              '& .MuiDataGrid-cell': {
                fontSize: '1rem',
              },
              '& .MuiDataGrid-columnHeader': {
                fontSize: '1.05rem',
                fontWeight: 'bold',
              },
            }}
          />
        </div>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedImage ? 'Edit Image / Video' : 'Add Image / Video'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Image Name"
            type="text"
            fullWidth
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
          />

          <div style={{ marginTop: 12 }}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files && e.target.files[0];
                setImageFile(file || null);
                if (file) setImagePreview(URL.createObjectURL(file));
              }}
            />
          </div>

          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: '100%', height: 220, marginTop: 16, objectFit: 'cover', borderRadius: 8 }}
            />
          ) : selectedImage && selectedImage.imageUrl ? (
            <img
              src={selectedImage.imageUrl}
              alt="Existing"
              style={{ width: '100%', height: 220, marginTop: 16, objectFit: 'cover', borderRadius: 8 }}
            />
          ) : null}

          <TextField
            margin="dense"
            label="Video URL (YouTube / Vimeo or direct link)"
            type="url"
            fullWidth
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            helperText="If you provide a video URL, image is optional."
            style={{ marginTop: 16 }}
          />

          <FormControl fullWidth style={{ marginTop: 16 }}>
            <InputLabel>Image Type</InputLabel>
            <Select value={imageType} onChange={(e) => setImageType(e.target.value)}>
              <MenuItem value="Desktop">Desktop</MenuItem>
              <MenuItem value="mobile">Mobile</MenuItem>
              <MenuItem value="homepage_web">Homepage Desktop</MenuItem>
              <MenuItem value="homepage_mobile">Homepage Mobile</MenuItem>

              <MenuItem value="weddings-thumbnail">Weddings Thumbnail</MenuItem>
              <MenuItem value="events-thumbnail">Events Thumbnail</MenuItem>
              <MenuItem value="live-streaming-thumbnail">Live Streaming Thumbnail</MenuItem>
              <MenuItem value="portraits-headshots-thumbnail">Portraits & Headshots Thumbnail</MenuItem>
              <MenuItem value="family-kids-thumbnail">Family & Kids Thumbnail</MenuItem>
              <MenuItem value="fashion-shoots-thumbnail">Fashion Shoots Thumbnail</MenuItem>
              <MenuItem value="editorial-portfolio-thumbnail">Editorial Portfolio Thumbnail</MenuItem>
              <MenuItem value="boudoir-shoots-thumbnail">Boudoir Shoots Thumbnail</MenuItem>
              <MenuItem value="brand-content-thumbnail">Brand Content Thumbnail</MenuItem>
              <MenuItem value="product-ecommerce-thumbnail">Product E-commerce Thumbnail</MenuItem>
              <MenuItem value="food-photography-thumbnail">Food Photography Thumbnail</MenuItem>
              <MenuItem value="corporate-industrial-thumbnail">Corporate & Industrial Thumbnail</MenuItem>
              <MenuItem value="real-estate-architectural-thumbnail">Real Estate & Architectural Thumbnail</MenuItem>
              <MenuItem value="influencer-celebrity-thumbnail">Influencer & Celebrity Thumbnail</MenuItem>
              <MenuItem value="podcast-production-thumbnail">Podcast Production Thumbnail</MenuItem>
              <MenuItem value="editing-retouching-thumbnail">Editing & Retouching Thumbnail</MenuItem>
              <MenuItem value="album-design-thumbnail">Album Design Thumbnail</MenuItem>
              <MenuItem value="drone-services-thumbnail">Drone Services Thumbnail</MenuItem>
              <MenuItem value="design-services-thumbnail">Design Services Thumbnail</MenuItem>

              <MenuItem value="weddings">Weddings</MenuItem>
              <MenuItem value="events">Events</MenuItem>
              <MenuItem value="live-streaming">Live Streaming</MenuItem>
              <MenuItem value="portraits-headshots">Portraits & Headshots</MenuItem>
              <MenuItem value="family-kids">Family & Kids</MenuItem>
              <MenuItem value="fashion-shoots">Fashion Shoots</MenuItem>
              <MenuItem value="editorial-portfolio">Editorial Portfolio</MenuItem>
              <MenuItem value="boudoir-shoots">Boudoir Shoots</MenuItem>
              <MenuItem value="brand-content">Brand Content</MenuItem>
              <MenuItem value="product-ecommerce">Product E-commerce</MenuItem>
              <MenuItem value="food-photography">Food Photography</MenuItem>
              <MenuItem value="corporate-industrial">Corporate & Industrial</MenuItem>
              <MenuItem value="real-estate-architectural">Real Estate & Architectural</MenuItem>
              <MenuItem value="influencer-celebrity">Influencer & Celebrity</MenuItem>
              <MenuItem value="podcast-production">Podcast Production</MenuItem>
              <MenuItem value="editing-retouching">Editing & Retouching</MenuItem>
              <MenuItem value="album-design">Album Design</MenuItem>
              <MenuItem value="drone-services">Drone Services</MenuItem>
              <MenuItem value="design-services">Design Services</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); resetForm(); }} color="secondary">Cancel</Button>
          <Button onClick={handleSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this image?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomePageCarousel;