import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from '@mui/material';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from 'utils/axiosInstance';

const EditHomepageContent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [mediaType, setMediaType] = useState('video'); // 'video' | 'image'
    const [mediaSource, setMediaSource] = useState('');
    const [headline, setHeadline] = useState('');
    const [subheadline, setSubheadline] = useState('');

    const fetchHomepageContent = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/homepage/content');
            const data = res.data?.data || res.data;
            if (data) {
                setMediaType(data.mediaType || 'video');
                setMediaSource(data.mediaSource || '');
                setHeadline(data.headline || '');
                setSubheadline(data.subheadline || '');
            }
        } catch (err) {
            if (err?.response?.status !== 404) {
                toast.error('Failed to load homepage content');
            }
            setHeadline('Your Love Story, Our Masterpiece');
            setSubheadline('Top-rated professional photography and videography services in Mumbai. Specializing in weddings, events, portraits, fashion, and commercial content.');
            setMediaSource('https://youtube.com/watch?v=22SExhaXwi0');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHomepageContent();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await axiosInstance.put('/homepage/content', {
                mediaType,
                mediaSource: mediaSource.trim() || undefined,
                headline: headline.trim() || undefined,
                subheadline: subheadline.trim() || undefined,
            });
            toast.success('Homepage content saved');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Button startIcon={<ArrowLeftOutlined />} onClick={() => navigate('/manage-gallary')} sx={{ mb: 2 }}>
                Back to Manage Gallery
            </Button>

            <Typography variant="h5" fontWeight={600} gutterBottom>
                Edit Homepage Content
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Update the background media, text, and category thumbnails for the main page.
            </Typography>

            {loading ? (
                <Typography>Loading...</Typography>
            ) : (
                <>
                    <Card variant="outlined" sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                Hero Section Background
                            </Typography>
                            <RadioGroup row value={mediaType} onChange={(e) => setMediaType(e.target.value)} sx={{ mb: 2 }}>
                                <FormControlLabel value="video" control={<Radio />} label="Video" />
                                <FormControlLabel value="image" control={<Radio />} label="Image" />
                            </RadioGroup>
                            <TextField
                                fullWidth
                                label="Media Source"
                                placeholder={mediaType === 'video' ? 'Enter a YouTube video link' : 'Enter image URL or upload'}
                                value={mediaSource}
                                onChange={(e) => setMediaSource(e.target.value)}
                                helperText={mediaType === 'video' ? 'e.g. https://youtube.com/watch?v=...' : 'Image URL for hero background'}
                            />
                            {mediaSource && mediaType === 'video' && (
                                <Box sx={{ mt: 2, borderRadius: 1, overflow: 'hidden', bgcolor: '#000' }}>
                                    <iframe
                                        title="Hero video preview"
                                        width="100%"
                                        height="240"
                                        src={mediaSource.replace('watch?v=', 'embed/').split('&')[0]}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </Box>
                            )}
                        </CardContent>
                    </Card>

                    <Card variant="outlined" sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                                Hero Text Content
                            </Typography>
                            <TextField
                                fullWidth
                                label="Headline"
                                value={headline}
                                onChange={(e) => setHeadline(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Subheadline"
                                multiline
                                rows={3}
                                value={subheadline}
                                onChange={(e) => setSubheadline(e.target.value)}
                            />
                        </CardContent>
                    </Card>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="contained" onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving...' : 'Save changes'}
                        </Button>
                        <Button onClick={() => navigate('/manage-gallary')}>Cancel</Button>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default EditHomepageContent;
