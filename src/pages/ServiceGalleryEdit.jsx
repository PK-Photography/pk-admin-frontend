import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    CircularProgress,
} from '@mui/material';
import { ArrowLeftOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from 'utils/axiosInstance';

const ServiceGalleryEdit = () => {
    const navigate = useNavigate();
    const { serviceId } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const validServiceId = serviceId && serviceId !== 'undefined' && String(serviceId).trim() !== '';
    const [saving, setSaving] = useState(false);
    const [cardThumbnailFile, setCardThumbnailFile] = useState(null);
    const [cardThumbnailPreview, setCardThumbnailPreview] = useState('');
    const [heroFile, setHeroFile] = useState(null);
    const [heroPreview, setHeroPreview] = useState('');
    const [aboutFile, setAboutFile] = useState(null);
    const [aboutPreview, setAboutPreview] = useState('');

    useEffect(() => {
        if (!validServiceId) {
            setLoading(false);
            setService({ name: 'Service', _id: serviceId });
            return;
        }
        const fetchService = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get('/services');
                const list = Array.isArray(res.data) ? res.data : [];
                const found = list.find((s) => s._id === serviceId);
                if (found) {
                    setService(found);
                    setCardThumbnailPreview(found.imageUrl || '');
                    setHeroPreview(found.heroImageUrl || found.coverImageUrl || found.imageUrl || '');
                    setAboutPreview(found.aboutImageUrl || found.aboutSectionImageUrl || found.imageUrl || '');
                } else {
                    setService({ name: 'Service', _id: serviceId });
                }
            } catch {
                setService({ name: 'Service', _id: serviceId });
                toast.error('Failed to load service');
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [serviceId, validServiceId]);

    const handleSave = async () => {
        if (!service?._id) return;
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('name', service.name || '');
            if (service.description) formData.append('description', service.description);
            if (service.duration) formData.append('duration', service.duration || '');
            if (cardThumbnailFile) formData.append('file', cardThumbnailFile);
            if (heroFile) formData.append('heroImage', heroFile);
            if (aboutFile) formData.append('aboutImage', aboutFile);

            await axiosInstance.put(`/services/${service._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Images updated');
            setCardThumbnailFile(null);
            setHeroFile(null);
            setAboutFile(null);
            const res = await axiosInstance.get('/services');
            const list = Array.isArray(res.data) ? res.data : [];
            const updated = list.find((s) => s._id === serviceId);
            if (updated) {
                setService(updated);
                setCardThumbnailPreview(updated.imageUrl || '');
                setHeroPreview(updated.heroImageUrl || updated.coverImageUrl || updated.imageUrl || '');
                setAboutPreview(updated.aboutImageUrl || updated.aboutSectionImageUrl || updated.imageUrl || '');
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to update images');
        } finally {
            setSaving(false);
        }
    };

    const hasChanges = cardThumbnailFile || heroFile || aboutFile;

    if (loading) {
        return (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 960, mx: 'auto' }}>
            <Button
                startIcon={<ArrowLeftOutlined />}
                onClick={() => navigate('/manage-gallary', { replace: false })}
                sx={{ mb: 2 }}
            >
                Back to Manage Gallery
            </Button>

            <Typography variant="h4" fontWeight={600} gutterBottom>
                Edit Images: {service?.name || 'Service'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Update all images associated with this service page.
            </Typography>

            <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
                <StarOutlined style={{ fontSize: 18 }} />
                Core Page Images
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 3,
                    mb: 3,
                }}
            >
                {/* Card Thumbnail */}
                <Card variant="outlined" sx={{ borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                    <CardContent>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Card Thumbnail
                        </Typography>
                        <Box
                            sx={{
                                width: '100%',
                                aspectRatio: '4/3',
                                borderRadius: 1,
                                bgcolor: 'grey.200',
                                overflow: 'hidden',
                                mb: 1.5,
                            }}
                        >
                            {(cardThumbnailPreview || cardThumbnailFile) && (
                                <Box
                                    component="img"
                                    src={cardThumbnailFile ? URL.createObjectURL(cardThumbnailFile) : cardThumbnailPreview}
                                    alt="Card thumbnail"
                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            )}
                            {!cardThumbnailPreview && !cardThumbnailFile && (
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Typography variant="body2" color="text.secondary">
                                        No image
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Shown on the main service listing.
                        </Typography>
                        <Button variant="outlined" component="label" size="small" fullWidth>
                            Update image
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    setCardThumbnailFile(f || null);
                                    if (f) setCardThumbnailPreview(URL.createObjectURL(f));
                                }}
                            />
                        </Button>
                    </CardContent>
                </Card>

                {/* Page Cover Image (Hero) */}
                <Card variant="outlined" sx={{ borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                    <CardContent>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Page Cover Image (Hero)
                        </Typography>
                        <Box
                            sx={{
                                width: '100%',
                                aspectRatio: '4/3',
                                borderRadius: 1,
                                bgcolor: 'grey.200',
                                overflow: 'hidden',
                                mb: 1.5,
                            }}
                        >
                            {(heroPreview || heroFile) && (
                                <Box
                                    component="img"
                                    src={heroFile ? URL.createObjectURL(heroFile) : heroPreview}
                                    alt="Page hero"
                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            )}
                            {!heroPreview && !heroFile && (
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Typography variant="body2" color="text.secondary">
                                        No image
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            The main hero image for the page.
                        </Typography>
                        <Button variant="outlined" component="label" size="small" fullWidth>
                            Update image
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    setHeroFile(f || null);
                                    if (f) setHeroPreview(URL.createObjectURL(f));
                                }}
                            />
                        </Button>
                    </CardContent>
                </Card>

                {/* About Section Image */}
                <Card variant="outlined" sx={{ borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                    <CardContent>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            About Section Image
                        </Typography>
                        <Box
                            sx={{
                                width: '100%',
                                aspectRatio: '4/3',
                                borderRadius: 1,
                                bgcolor: 'grey.200',
                                overflow: 'hidden',
                                mb: 1.5,
                            }}
                        >
                            {(aboutPreview || aboutFile) && (
                                <Box
                                    component="img"
                                    src={aboutFile ? URL.createObjectURL(aboutFile) : aboutPreview}
                                    alt="About section"
                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            )}
                            {!aboutPreview && !aboutFile && (
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Typography variant="body2" color="text.secondary">
                                        No image
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Image next to the main description.
                        </Typography>
                        <Button variant="outlined" component="label" size="small" fullWidth>
                            Update image
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    setAboutFile(f || null);
                                    if (f) setAboutPreview(URL.createObjectURL(f));
                                }}
                            />
                        </Button>
                    </CardContent>
                </Card>
            </Box>

            {hasChanges && (
                <Button variant="contained" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save changes'}
                </Button>
            )}
        </Box>
    );
};

export default ServiceGalleryEdit;
