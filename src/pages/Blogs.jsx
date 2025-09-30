import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message, Space, Card, Typography, Popconfirm, Spin } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import axiosInstance from 'utils/axiosInstance';
import ReactQuill from 'react-quill';

const { Title } = Typography;

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [form] = Form.useForm();

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/blogs');
      setBlogs(res.data);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      message.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  // Save blog (create/update)
  const handleSave = async (values) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('subtitle', values.subtitle);
    formData.append('content', values.content);
    if (values.author) formData.append('author', values.author);
    if (values.image && values.image.length > 0) {
      formData.append('image', values.image[0].originFileObj);
    }

    try {
      if (editingBlog) {
        await axiosInstance.put(`/blogs/${editingBlog._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('Blog updated successfully');
      } else {
        await axiosInstance.post('/blogs', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('Blog created successfully');
      }
      fetchBlogs();
      setIsModalOpen(false);
      setEditingBlog(null);
      form.resetFields();
    } catch (err) {
      console.error('Error saving blog:', err);
      message.error('Failed to save blog');
    }
  };

  // Delete blog
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/blogs/${id}`);
      message.success('Blog deleted successfully');
      fetchBlogs();
    } catch (err) {
      console.error('Delete failed:', err);
      message.error('Failed to delete blog');
    }
  };

  // Open modal for edit
  const handleEdit = (record) => {
    setEditingBlog(record);
    form.setFieldsValue({
      title: record.title,
      subtitle: record.subtitle,
      content: record.content,
      author: record.author
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
    form.resetFields();
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (img) =>
        img ? (
          <img
            src={img}
            alt="blog"
            style={{
              width: 100,
              height: 120,
              objectFit: 'cover',
              borderRadius: 6
            }}
          />
        ) : (
          <span style={{ color: '#999' }}>No Image</span>
        )
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => (text ? <b>{text}</b> : '-')
    },
    {
      title: 'Subtitle',
      dataIndex: 'subtitle',
      key: 'subtitle'
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author'
    },
    {
      title: 'Views',
      dataIndex: 'views',
      key: 'views'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm title="Are you sure to delete this blog?" onConfirm={() => handleDelete(record._id)}>
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
        Blogs
      </Title>

      <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 20 }} onClick={() => setIsModalOpen(true)}>
        Add Blog
      </Button>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table dataSource={blogs} columns={columns} rowKey="_id" bordered pagination={{ pageSize: 8 }} />
      )}

      <Modal
        title={editingBlog ? 'Edit Blog' : 'Add Blog'}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="Save"
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="title" label="Blog Title" rules={[{ required: true, message: 'Please enter blog title' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="subtitle" label="Subtitle" rules={[{ required: true, message: 'Please enter subtitle' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="author" label="Author">
            <Input placeholder="Default: PK Photography" />
          </Form.Item>
          <Form.Item name="content" label="Content" rules={[{ required: true, message: 'Please enter content' }]}>
            <ReactQuill
              theme="snow"
              style={{ height: 200, marginBottom: 40 }}
              onChange={(value) => form.setFieldsValue({ content: value })}
            />
          </Form.Item>
          <Form.Item
            name="image"
            label="Upload Image"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e?.fileList;
            }}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Blogs;
