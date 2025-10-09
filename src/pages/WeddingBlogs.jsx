import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message, Space, Card, Typography, Popconfirm, Spin, Select, DatePicker } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import axiosInstance from 'utils/axiosInstance';
import ReactQuill from 'react-quill';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const WeddingBlogs = () => {
  const [weddingBlogs, setWeddingBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [form] = Form.useForm();

  // Fetch blogs
  const fetchWeddingBlogs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/wedding-blogs');
      setWeddingBlogs(res.data);
    } catch (err) {
      console.error('Error fetching wedding blogs:', err);
      message.error('Failed to fetch wedding blogs');
    } finally {
      setLoading(false);
    }
  };

  // Save blog (create/update)
  const handleSave = async (values) => {
    const formData = new FormData();
    formData.append('type', values.type);
    formData.append('date', values.date.toISOString());
    formData.append('header', values.header);
    formData.append('content', values.content);

    if (values.video && values.video.length > 0) {
      formData.append('video', values.video[0].originFileObj);
    }

    if (values.images && values.images.length > 0) {
      values.images.forEach((file) => formData.append('images', file.originFileObj));
    }

    try {
      if (editingBlog) {
        await axiosInstance.put(`/wedding-blogs/${editingBlog._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('Wedding blog updated successfully');
      } else {
        await axiosInstance.post('/wedding-blogs', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('Wedding blog created successfully');
      }
      fetchWeddingBlogs();
      setIsModalOpen(false);
      setEditingBlog(null);
      form.resetFields();
    } catch (err) {
      console.error('Error saving wedding blog:', err);
      message.error('Failed to save wedding blog');
    }
  };

  // Delete blog
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/wedding-blogs/${id}`);
      message.success('Wedding blog deleted successfully');
      fetchWeddingBlogs();
    } catch (err) {
      console.error('Delete failed:', err);
      message.error('Failed to delete wedding blog');
    }
  };

  // Open modal for edit
  const handleEdit = (record) => {
    setEditingBlog(record);
    form.setFieldsValue({
      type: record.type,
      date: dayjs(record.date),
      header: record.header,
      content: record.content
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
    form.resetFields();
  };

  useEffect(() => {
    fetchWeddingBlogs();
  }, []);

  const columns = [
    {
      title: 'Images',
      dataIndex: 'imageUrls',
      key: 'imageUrls',
      render: (imgs) =>
        imgs && imgs.length > 0 ? (
          <Space>
            {imgs.slice(0, 2).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="wedding"
                style={{
                  width: 80,
                  height: 80,
                  objectFit: 'cover',
                  borderRadius: 6
                }}
              />
            ))}
            {imgs.length > 2 && <span>+{imgs.length - 2} more</span>}
          </Space>
        ) : (
          <span style={{ color: '#999' }}>No Images</span>
        )
    },
    {
      title: 'Header',
      dataIndex: 'header',
      key: 'header',
      render: (text) => (text ? <b>{text}</b> : '-')
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (d) => (d ? dayjs(d).format('DD MMM YYYY') : '-')
    },
    {
      title: 'Video',
      dataIndex: 'videoUrl',
      key: 'videoUrl',
      render: (v) =>
        v ? (
          <a href={v} target="_blank" rel="noopener noreferrer">
            View Video
          </a>
        ) : (
          <span style={{ color: '#999' }}>No Video</span>
        )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm title="Are you sure to delete this wedding blog?" onConfirm={() => handleDelete(record._id)}>
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Card style={{ margin: 20 }}>
      <Title level={3} style={{ marginBottom: 20 }}>
        Wedding Blogs
      </Title>

      <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 20 }} onClick={() => setIsModalOpen(true)}>
        Add Wedding Blog
      </Button>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table dataSource={weddingBlogs} columns={columns} rowKey="_id" bordered pagination={{ pageSize: 6 }} />
      )}

      <Modal
        title={editingBlog ? 'Edit Wedding Blog' : 'Add Wedding Blog'}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="Save"
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Please select type' }]}>
            <Select placeholder="Select blog type">
              <Option value="Engagement">Engagement</Option>
              <Option value="Pre-wedding">Pre-wedding</Option>
              <Option value="Bridal portraits">Bridal portraits</Option>
              <Option value="Couple rituals">Couple rituals</Option>
              <Option value="Family emotions">Family emotions</Option>
              <Option value="Reception">Reception</Option>
            </Select>
          </Form.Item>

          <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Please select date' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="header" label="Header" rules={[{ required: true, message: 'Please enter header' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="content" label="Content" rules={[{ required: true, message: 'Please enter content' }]}>
            <ReactQuill
              theme="snow"
              style={{ height: 200, marginBottom: 40 }}
              onChange={(value) => form.setFieldsValue({ content: value })}
            />
          </Form.Item>

          <Form.Item
            name="images"
            label="Upload Images"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload beforeUpload={() => false} multiple>
              <Button icon={<UploadOutlined />}>Select Images</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="video"
            label="Upload Video"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload beforeUpload={() => false} maxCount={1} accept="video/*">
              <Button icon={<UploadOutlined />}>Select Video</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default WeddingBlogs;
