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
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from 'utils/axiosInstance';

/**
 * Dedicated page to edit service page images:
 * - Card Thumbnail (main service listing)
 * - Page Cover Image (Hero)
 * - About Section Image
 * All updated via file upload (Update image), no URL input.
 */
const EditServicePageImages = () => {
    const navigate = useNavigate();
    const { serviceId } = useParams();
    const location = useLocation();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [cardThumbnailFile, setCardThumbnailFile] = useState(null);
    const [cardThumbnailPreview, setCardThumbnailPreview] = useState('');
    const [heroFile, setHeroFile] = useState(null);
    const [heroPreview, setHeroPreview] = useState('');
    const [aboutFile, setAboutFile] = useState(null);
    const [aboutPreview, setAboutPreview] = useState('');
    const [clearCardThumbnail, setClearCardThumbnail] = useState(false);
    const [clearHero, setClearHero] = useState(false);
    const [clearAbout, setClearAbout] = useState(false);

    const isNewService = serviceId === 'new';
    const state = location.state || {};
    const validServiceId =
        serviceId &&
        serviceId !== 'undefined' &&
        String(serviceId).trim() !== '' &&
        !isNewService;

    useEffect(() => {
        const resolveOrLoadService = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get('/services');
                const list = Array.isArray(res.data) ? res.data : [];

                if (isNewService) {
                    const name = (state.serviceName || '').trim();
                    const nameKey = name.toLowerCase();
                    const found = list.find(
                        (s) => (s.name || '').trim().toLowerCase() === nameKey
                    );
                    if (found) {
                        navigate(`/manage-gallary/service/${found._id}`, {
                            replace: true,
                        });
                        return;
                    }
                    const formData = new FormData();
                    formData.append('name', name || 'Service');
                    if (state.description) formData.append('description', state.description);
                    if (state.category) formData.append('category', state.category);
                    try {
                        const createRes = await axiosInstance.post('/services', formData, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                        });
                        const data = createRes.data?.data ?? createRes.data;
                        const newId =
                            data?._id ||
                            data?.id ||
                            createRes.data?._id ||
                            createRes.data?.id;
                        if (newId) {
                            navigate(`/manage-gallary/service/${newId}`, {
                                replace: true,
                            });
                            return;
                        }
                    } catch {
                        // Create failed; show page with message
                    }
                    setService({
                        name: name || 'Service',
                        _id: null,
                        category: state.category,
                        description: state.description,
                    });
                    setLoading(false);
                    return;
                }

                const found = list.find((s) => s._id === serviceId);
                if (found) {
                    setService(found);
                    setCardThumbnailPreview(found.imageUrl || '');
                    setHeroPreview(found.heroImageUrl || found.coverImageUrl || found.imageUrl || '');
                    setAboutPreview(
                        found.aboutImageUrl || found.aboutSectionImageUrl || found.imageUrl || ''
                    );
                } else {
                    setService({ name: 'Service', _id: serviceId });
                }
            } catch {
                if (isNewService) {
                    setService({
                        name: (state.serviceName || '').trim() || 'Service',
                        _id: null,
                        category: state.category,
                        description: state.description,
                    });
                } else {
                    setService({ name: 'Service', _id: serviceId });
                    toast.error('Failed to load service');
                }
            } finally {
                setLoading(false);
            }
        };

        resolveOrLoadService();
    }, [serviceId, isNewService, navigate, state.serviceName, state.category, state.description]);

    const handleSave = async () => {
        if (!service?._id) {
            toast.error('Cannot save: service not loaded');
            return;
        }
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('name', service.name || '');
            if (service.description) formData.append('description', service.description);
            if (service.duration) formData.append('duration', service.duration || '');
            if (cardThumbnailFile) formData.append('file', cardThumbnailFile);
            if (heroFile) formData.append('heroImage', heroFile);
            if (aboutFile) formData.append('aboutImage', aboutFile);
            if (clearCardThumbnail) formData.append('clearCardThumbnail', 'true');
            if (clearHero) formData.append('clearHeroImage', 'true');
            if (clearAbout) formData.append('clearAboutImage', 'true');

            await axiosInstance.put(`/services/${service._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Images updated');
            setCardThumbnailFile(null);
            setHeroFile(null);
            setAboutFile(null);
            setClearCardThumbnail(false);
            setClearHero(false);
            setClearAbout(false);
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

    const hasChanges =
        cardThumbnailFile ||
        heroFile ||
        aboutFile ||
        clearCardThumbnail ||
        clearHero ||
        clearAbout;

    const ImageCard = ({
        title,
        description,
        preview,
        file,
        setFile,
        setPreview,
        acceptId,
        clearFlag,
        setClearFlag,
    }) => (
        <Card variant="outlined" sx={{ borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
            <CardContent>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    {title}
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
                    {(preview || file) && !clearFlag ? (
                        <Box
                            component="img"
                            src={file ? URL.createObjectURL(file) : preview}
                            alt={title}
                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
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
                    {description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button variant="outlined" component="label" size="small">
                        Update image
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            id={acceptId}
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                setFile(f || null);
                                setClearFlag(false);
                                if (f) setPreview(URL.createObjectURL(f));
                                e.target.value = '';
                            }}
                        />
                    </Button>
                    {(preview || file) && (
                        <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            onClick={() => {
                                setFile(null);
                                setPreview('');
                                setClearFlag(true);
                            }}
                        >
                            Remove image
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 960, mx: 'auto' }}>
            <Button
                startIcon={<ArrowLeftOutlined />}
                onClick={() => navigate('/manage-gallary')}
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

            {service && !service._id && (
                <Card
                    variant="outlined"
                    sx={{
                        mb: 3,
                        borderColor: 'warning.main',
                        bgcolor: 'warning.light',
                        borderWidth: 1,
                    }}
                >
                    <CardContent>
                        <Typography variant="body2" sx={{ mb: 1.5 }}>
                            This service is not in the system yet. Add it from the Services page
                            first, then return here to edit images.
                        </Typography>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => navigate('/services')}
                        >
                            Go to Services
                        </Button>
                    </CardContent>
                </Card>
            )}

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
                <ImageCard
                    title="Card Thumbnail"
                    description="Shown on the main service listing."
                    preview={cardThumbnailPreview}
                    file={cardThumbnailFile}
                    setFile={setCardThumbnailFile}
                    setPreview={setCardThumbnailPreview}
                    acceptId="card-thumbnail"
                    clearFlag={clearCardThumbnail}
                    setClearFlag={setClearCardThumbnail}
                />
                <ImageCard
                    title="Page Cover Image (Hero)"
                    description="The main hero image for the page."
                    preview={heroPreview}
                    file={heroFile}
                    setFile={setHeroFile}
                    setPreview={setHeroPreview}
                    acceptId="hero-image"
                    clearFlag={clearHero}
                    setClearFlag={setClearHero}
                />
                <ImageCard
                    title="About Section Image"
                    description="Image next to the main description."
                    preview={aboutPreview}
                    file={aboutFile}
                    setFile={setAboutFile}
                    setPreview={setAboutPreview}
                    acceptId="about-image"
                    clearFlag={clearAbout}
                    setClearFlag={setClearAbout}
                />
            </Box>

            {hasChanges && (
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving || !service?._id}
                >
                    {saving ? 'Saving...' : 'Save changes'}
                </Button>
            )}
        </Box>
    );
};

export default EditServicePageImages;
