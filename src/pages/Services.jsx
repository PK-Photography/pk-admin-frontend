import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message, Space, Card, Typography, Popconfirm, Spin } from 'antd';
import { PlusOutlined, UploadOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import axiosInstance from 'utils/axiosInstance';
import { PKPHOTOGRAPHY_SERVICES } from 'constants/pkphotographyServices';

const { Title } = Typography;

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
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

  // Import services from pkphotography.in list (skips existing by name)
  const handleImportFromWebsite = async () => {
    const existingNames = new Set((services || []).map((s) => (s.name || '').trim().toLowerCase()));
    const toAdd = PKPHOTOGRAPHY_SERVICES.filter((s) => !existingNames.has((s.name || '').trim().toLowerCase()));
    if (toAdd.length === 0) {
      message.info('All services from pkphotography.in are already added.');
      return;
    }
    setImporting(true);
    let added = 0;
    let failed = 0;
    for (const svc of toAdd) {
      try {
        const formData = new FormData();
        formData.append('name', svc.name);
        if (svc.description) formData.append('description', svc.description);
        if (svc.category) formData.append('category', svc.category);
        await axiosInstance.post('/services', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        added++;
        existingNames.add(svc.name.trim().toLowerCase());
      } catch (err) {
        console.error('Error adding service:', err);
        failed++;
      }
    }
    setImporting(false);
    await fetchServices();
    if (added > 0) message.success(`Added ${added} service(s) from pkphotography.in`);
    if (failed > 0) message.warning(`${failed} service(s) could not be added. Check console.`);
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
          <img src={img} alt="service" style={{ width: 100, height: 120, objectFit: 'fit', borderRadius: 6 }} />
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

      <Space wrap style={{ marginBottom: 20 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Add Service
        </Button>
        <Button
          icon={<CloudDownloadOutlined />}
          loading={importing}
          onClick={handleImportFromWebsite}
        >
          Import from pkphotography.in
        </Button>
      </Space>

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
