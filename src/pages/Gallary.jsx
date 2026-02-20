import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    CircularProgress,
} from '@mui/material';
import { HomeOutlined, MenuOutlined, EditOutlined } from '@ant-design/icons';
import axiosInstance from 'utils/axiosInstance';
import { PKPHOTOGRAPHY_SERVICES } from 'constants/pkphotographyServices';

const Gallary = () => {
    const navigate = useNavigate();
    const [apiServices, setApiServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axiosInstance.get('/services');
                setApiServices(Array.isArray(res.data) ? res.data : []);
            } catch {
                setApiServices([]);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    // Merge pkphotography.in list with API: each website service gets _id and imageUrl if we have a match by name
    const displayServices = PKPHOTOGRAPHY_SERVICES.map((web) => {
        const nameKey = (web.name || '').trim().toLowerCase();
        const matched = apiServices.find((s) => (s.name || '').trim().toLowerCase() === nameKey);
        return {
            ...web,
            _id: matched?._id,
            imageUrl: matched?.imageUrl,
        };
    });

    const openEditPageImages = (svc) => {
        if (svc._id) {
            navigate(`/manage-gallary/service/${svc._id}`);
        } else {
            navigate('/manage-gallary/service/new', {
                state: {
                    serviceName: svc.name,
                    category: svc.category,
                    description: svc.description,
                },
            });
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
                Manage Gallery
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Manage images for your homepage and individual service pages on{' '}
                <Typography component="a" href="https://pkphotography.in/" target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main' }}>
                    pkphotography.in
                </Typography>
                .
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {/* Manage Homepage */}
                    <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
                        <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1 }}>
                                <HomeOutlined style={{ color: 'inherit', marginTop: 2 }} />
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" fontWeight={600}>
                                        Manage Homepage
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Update the main hero section and category card images on your homepage.
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ pl: 4.5, pt: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Hero Section & Category Images
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Update background media, text, and category card thumbnails.
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<EditOutlined />}
                                    onClick={() => navigate('/manage-gallary/edit-homepage')}
                                >
                                    Edit Homepage
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Manage Service Pages - from pkphotography.in/services, UI per screenshot */}
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ '&:last-child': { pb: 3 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                                <MenuOutlined style={{ color: 'inherit', marginTop: 2 }} />
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" fontWeight={600}>
                                        Manage Service Pages
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Update all images for your individual service pages.
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {displayServices.map((svc) => (
                                    <Box
                                        key={svc.name}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: 'grey.100',
                                            border: '1px solid',
                                            borderColor: 'grey.200',
                                        }}
                                    >
                                        {svc.imageUrl ? (
                                            <Box
                                                component="img"
                                                src={svc.imageUrl}
                                                alt=""
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    objectFit: 'cover',
                                                    borderRadius: 1.5,
                                                    bgcolor: 'grey.300',
                                                    flexShrink: 0,
                                                }}
                                            />
                                        ) : (
                                            <Box
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: 1.5,
                                                    bgcolor: 'grey.300',
                                                    flexShrink: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Typography variant="caption" color="text.secondary">
                                                    No image
                                                </Typography>
                                            </Box>
                                        )}
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.25 }}>
                                                {svc.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {svc.category}
                                            </Typography>
                                        </Box>
                                        <Button
                                            variant="outlined"
                                            size="medium"
                                            startIcon={<EditOutlined />}
                                            onClick={() => openEditPageImages(svc)}
                                            sx={{ flexShrink: 0 }}
                                        >
                                            Edit Page Images
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </>
            )}
        </Box>
    );
};

export default Gallary;
