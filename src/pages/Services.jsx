import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message, Space, Card, Typography, Popconfirm, Spin } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import axiosInstance from 'utils/axiosInstance';

const { Title } = Typography;

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form] = Form.useForm();

  // Fetch all services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/services');
      setServices(res.data);
    } catch (err) {
      console.error('Error fetching services:', err);
      message.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  // Create / Update service
  const handleSave = async (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    if (values.description) formData.append('description', values.description);
    if (values.duration) formData.append('duration', values.duration);
    if (values.image && values.image.length > 0) {
      formData.append('file', values.image[0].originFileObj);
    }

    try {
      if (editingService) {
        await axiosInstance.put(`/services/${editingService._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('Service updated successfully');
      } else {
        await axiosInstance.post('/services', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('Service created successfully');
      }
      fetchServices();
      setIsModalOpen(false);
      setEditingService(null);
      form.resetFields();
    } catch (err) {
      console.error('Error saving service:', err);
      message.error('Failed to save service');
    }
  };

  // Delete service
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/services/${id}`);
      message.success('Service deleted successfully');
      fetchServices();
    } catch (err) {
      console.error('Delete failed:', err);
      message.error('Failed to delete service');
    }
  };

  // Open modal for edit
  const handleEdit = (record) => {
    setEditingService(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      duration: record.duration
    });
    setIsModalOpen(true);
  };

  // Modal close
  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingService(null);
    form.resetFields();
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (img) =>
        img ? (
          //   <img
          //     src={`${process.env.REACT_APP_S3_BASE_URL}/${img}`}
          //     alt="service"
          //     style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }}
          //   />
          'img'
        ) : (
          <span style={{ color: '#999' }}>No Image</span>
        )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (text ? <b>{text}</b> : '-')
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (text ? <b>{text}</b> : '-')
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (text) => (text ? <b>{text}</b> : '-')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm title="Are you sure to delete this service?" onConfirm={() => handleDelete(record._id)}>
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
        Services
      </Title>

      <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 20 }} onClick={() => setIsModalOpen(true)}>
        Add Service
      </Button>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table dataSource={services} columns={columns} rowKey="_id" bordered pagination={{ pageSize: 8 }} />
      )}

      <Modal
        title={editingService ? 'Edit Service' : 'Add Service'}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="Save"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="name" label="Service Name" rules={[{ required: true, message: 'Please enter service name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="duration" label="Duration">
            <Input />
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

export default Services;
