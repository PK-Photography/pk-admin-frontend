import React, { useEffect, useState } from 'react';
import { Card, Button, Select, Input, Upload, message, Space, Typography, Modal } from 'antd';
import { UploadOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axiosInstance from 'utils/axiosInstance';

const { Title } = Typography;

const WeddingPageAdmin = () => {
  const [pageTypes, setPageTypes] = useState([]);
  const [pageType, setPageType] = useState(null);
  const [videoLink, setVideoLink] = useState('');

  const [contentImages, setContentImages] = useState([]);
  const [optionalImages, setOptionalImages] = useState([]);

  const [removedContentImages, setRemovedContentImages] = useState([]);
  const [removedOptionalImages, setRemovedOptionalImages] = useState([]);

  const [newPageModal, setNewPageModal] = useState(false);
  const [newPageType, setNewPageType] = useState('');

  // fetch page types
  const fetchPageTypes = async () => {
    try {
      const res = await axiosInstance.get('/wedding-pages');
      setPageTypes(res.data.data || []);
    } catch {
      message.error('Failed to fetch page types');
    }
  };

  // fetch page
  const fetchPage = async (type) => {
    try {
      const res = await axiosInstance.get(`/wedding-pages/${type}`);
      const page = res.data.data;

      setVideoLink(page.videoLink || '');

      setContentImages(
        page.imagesWithContent.map((img) => ({
          ...img,
          url: img.image,
          file: null
        }))
      );

      setOptionalImages(
        page.imagesWithOptionalText.map((img) => ({
          ...img,
          url: img.image,
          file: null
        }))
      );

      setRemovedContentImages([]);
      setRemovedOptionalImages([]);
    } catch (err) {
      console.log(err);
      message.error('Failed to load page');
    }
  };

  useEffect(() => {
    fetchPageTypes();
  }, []);

  useEffect(() => {
    if (pageType) fetchPage(pageType);
  }, [pageType]);

  // add new blocks
  const addContentImage = () => {
    setContentImages([...contentImages, { file: null, title: '', description: '' }]);
  };

  const addOptionalImage = () => {
    setOptionalImages([...optionalImages, { file: null, text: '' }]);
  };

  // remove blocks
  const removeContentImage = (index) => {
    const img = contentImages[index];

    if (img._id) {
      setRemovedContentImages([...removedContentImages, img._id]);
    }

    setContentImages(contentImages.filter((_, i) => i !== index));
  };

  const removeOptionalImage = (index) => {
    const img = optionalImages[index];

    if (img._id) {
      setRemovedOptionalImages([...removedOptionalImages, img._id]);
    }

    setOptionalImages(optionalImages.filter((_, i) => i !== index));
  };

  // save page
  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append('videoLink', videoLink);

      formData.append('removedContentImages', JSON.stringify(removedContentImages));

      formData.append('removedOptionalImages', JSON.stringify(removedOptionalImages));

      contentImages.forEach((item) => {
        if (item.file) {
          formData.append('contentImages', item.file);
        }
      });

      optionalImages.forEach((item) => {
        if (item.file) {
          formData.append('optionalImages', item.file);
        }
      });
      const newContentImages = contentImages.filter((item) => item.file);

      formData.append(
        'imagesWithContent',
        JSON.stringify(
          newContentImages.map((item) => ({
            title: item.title,
            description: item.description
          }))
        )
      );

      const newOptionalImages = optionalImages.filter((item) => item.file);

      formData.append(
        'imagesWithOptionalText',
        JSON.stringify(
          newOptionalImages.map((item) => ({
            text: item.text
          }))
        )
      );

      await axiosInstance.put(`/wedding-pages/${pageType}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      message.success('Page updated');
      fetchPage(pageType);
    } catch (err) {
      console.log(err);
      message.error('Update failed');
    }
  };

  // create page
  const handleCreatePage = async () => {
    try {
      await axiosInstance.post('/wedding-pages', {
        pageType: newPageType
      });

      message.success('Page created');

      setNewPageModal(false);
      setNewPageType('');

      fetchPageTypes();
    } catch {
      message.error('Failed to create page');
    }
  };

  return (
    <div style={{ padding: 24, background: '#f5f7fa', minHeight: '100vh' }}>
      <Card style={{ borderRadius: 12 }}>
        <Title level={3}>💍 Wedding Page CMS</Title>

        <Space style={{ marginBottom: 20 }}>
          <Select placeholder="Select Page" value={pageType} onChange={setPageType} style={{ width: 250 }}>
            {pageTypes.map((p) => (
              <Select.Option key={p} value={p}>
                {p}
              </Select.Option>
            ))}
          </Select>

          <Button icon={<PlusOutlined />} onClick={() => setNewPageModal(true)}>
            Create Page
          </Button>
        </Space>

        {pageType && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {/* VIDEO */}
            <Card title="Video Link">
              <Input value={videoLink} onChange={(e) => setVideoLink(e.target.value)} placeholder="Paste video link" />
            </Card>

            {/* CONTENT IMAGES */}
            <Card
              title="Images With Content"
              extra={
                <Button icon={<PlusOutlined />} onClick={addContentImage}>
                  Add Image
                </Button>
              }
            >
              {contentImages.map((item, index) => {
                const isExisting = !!item._id;

                return (
                  <Card
                    key={index}
                    size="small"
                    style={{ marginBottom: 16 }}
                    extra={<Button danger icon={<DeleteOutlined />} onClick={() => removeContentImage(index)} />}
                  >
                    {/* EXISTING IMAGE */}
                    {isExisting && item.url && (
                      <img alt="wedding" src={item.url} style={{ width: 200, marginBottom: 10, borderRadius: 6 }} />
                    )}

                    {/* NEW IMAGE PREVIEW */}
                    {!isExisting && item.file && (
                      <img alt="wedding" src={URL.createObjectURL(item.file)} style={{ width: 200, marginBottom: 10, borderRadius: 6 }} />
                    )}

                    {/* UPLOAD ONLY FOR NEW */}
                    {!isExisting && (
                      <Upload
                        beforeUpload={(file) => {
                          const updated = [...contentImages];
                          updated[index].file = file;
                          setContentImages(updated);
                          return false;
                        }}
                        maxCount={1}
                      >
                        <Button icon={<UploadOutlined />}>Upload Image</Button>
                      </Upload>
                    )}

                    <Input
                      placeholder="Title"
                      value={item.title}
                      disabled={isExisting}
                      onChange={(e) => {
                        const updated = [...contentImages];
                        updated[index].title = e.target.value;
                        setContentImages(updated);
                      }}
                      style={{ marginTop: 10 }}
                    />

                    <Input.TextArea
                      placeholder="Description"
                      value={item.description}
                      disabled={isExisting}
                      onChange={(e) => {
                        const updated = [...contentImages];
                        updated[index].description = e.target.value;
                        setContentImages(updated);
                      }}
                      style={{ marginTop: 10 }}
                    />
                  </Card>
                );
              })}
            </Card>

            {/* OPTIONAL IMAGES */}
            <Card
              title="Images With Optional Text"
              extra={
                <Button icon={<PlusOutlined />} onClick={addOptionalImage}>
                  Add Image
                </Button>
              }
            >
              {optionalImages.map((item, index) => {
                const isExisting = !!item._id;

                return (
                  <Card
                    key={index}
                    size="small"
                    style={{ marginBottom: 16 }}
                    extra={<Button danger icon={<DeleteOutlined />} onClick={() => removeOptionalImage(index)} />}
                  >
                    {isExisting && item.url && (
                      <img alt="wedding" src={item.url} style={{ width: 200, marginBottom: 10, borderRadius: 6 }} />
                    )}

                    {!isExisting && item.file && (
                      <img alt="wedding" src={URL.createObjectURL(item.file)} style={{ width: 200, marginBottom: 10, borderRadius: 6 }} />
                    )}

                    {!isExisting && (
                      <Upload
                        beforeUpload={(file) => {
                          const updated = [...optionalImages];
                          updated[index].file = file;
                          setOptionalImages(updated);
                          return false;
                        }}
                        maxCount={1}
                      >
                        <Button icon={<UploadOutlined />}>Upload Image</Button>
                      </Upload>
                    )}

                    <Input
                      placeholder="Text(Optional)"
                      value={item.text}
                      disabled={isExisting}
                      onChange={(e) => {
                        const updated = [...optionalImages];
                        updated[index].text = e.target.value;
                        setOptionalImages(updated);
                      }}
                      style={{ marginTop: 10 }}
                    />
                  </Card>
                );
              })}
            </Card>

            <Button type="primary" size="large" onClick={handleSave}>
              Save Page
            </Button>
          </Space>
        )}
      </Card>

      {/* CREATE PAGE MODAL */}
      <Modal title="Create Wedding Page" open={newPageModal} onCancel={() => setNewPageModal(false)} onOk={handleCreatePage}>
        <Input placeholder="Enter pageType (example: delhi)" value={newPageType} onChange={(e) => setNewPageType(e.target.value)} />
      </Modal>
    </div>
  );
};

export default WeddingPageAdmin;
