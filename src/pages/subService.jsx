import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message, Space, Card, Typography, Popconfirm, Spin, InputNumber, Select } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import axiosInstance from 'utils/axiosInstance';

const { Title } = Typography;
const { Option } = Select;

const SubServices = () => {
  const [subServices, setSubServices] = useState([]);
  const [services, setServices] = useState([]); // for serviceId dropdown
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubService, setEditingSubService] = useState(null);
  const [form] = Form.useForm();

  // Fetch subservices
  const fetchSubServices = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/subServices');
      setSubServices(res.data);
    } catch (err) {
      console.error('Error fetching subservices:', err);
      message.error('Failed to fetch sub-services');
    } finally {
      setLoading(false);
    }
  };

  // Fetch services (for dropdown)
  const fetchServices = async () => {
    try {
      const res = await axiosInstance.get('/services');
      setServices(res.data);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  useEffect(() => {
    fetchSubServices();
    fetchServices();
  }, []);

  // Create / Update subservice
  const handleSave = async (values) => {
    const formData = new FormData();
    formData.append('serviceId', values.serviceId);
    formData.append('name', values.name);
    formData.append('price', values.price);
    formData.append('time', values.time);
    formData.append('description', values.description);
    formData.append('whatYouGet', values.whatYouGet);
    formData.append('upgradeOption', values.upgradeOption);
    formData.append('perfectFor', values.perfectFor);
    if (values.advanceAmount) formData.append('advanceAmount', values.advanceAmount);
    if (values.image && values.image.length > 0) {
      formData.append('file', values.image[0].originFileObj);
    }

    try {
      if (editingSubService) {
        await axiosInstance.put(`/subServices/${editingSubService._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('SubService updated successfully');
      } else {
        await axiosInstance.post('/subServices', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('SubService created successfully');
      }
      fetchSubServices();
      setIsModalOpen(false);
      setEditingSubService(null);
      form.resetFields();
    } catch (err) {
      console.error('Error saving subservice:', err);
      message.error('Failed to save sub-service');
    }
  };

  // Delete subservice
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/subServices/${id}`);
      message.success('SubService deleted successfully');
      fetchSubServices();
    } catch (err) {
      console.error('Delete failed:', err);
      message.error('Failed to delete sub-service');
    }
  };

  // Edit
  const handleEdit = (record) => {
    setEditingSubService(record);
    form.setFieldsValue({
      serviceId: record.serviceId,
      name: record.name,
      price: record.price,
      time: record.time,
      description: record.description,
      advanceAmount: record.advanceAmount,
      whatYouGet: record.whatYouGet,
      upgradeOption: record.upgradeOption,
      perfectFor: record.perfectFor
    });
    setIsModalOpen(true);
  };

  // Modal close
  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingSubService(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (img) =>
        img ? (
          <img src={img} alt="subservice" style={{ width: 100, height: 120, objectFit: 'fit', borderRadius: 6 }} />
        ) : (
          <span style={{ color: '#999' }}>No Image</span>
        )
    },
    {
      title: 'Sub-Service',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <b>{text}</b>
    },
    {
      title: 'Service',
      dataIndex: 'serviceId',
      key: 'serviceId',
      render: (id) => {
        const service = services.find((s) => s._id === id);
        return service ? service.name : id;
      }
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `₹${price}`
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time'
    },

    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'What You Get',
      dataIndex: 'whatYouGet',
      key: 'whatYouGet'
    },
    {
      title: 'Upgrade Option',
      dataIndex: 'upgradeOption',
      key: 'upgradeOption'
    },
    {
      title: 'Perfect For',
      dataIndex: 'perfectFor',
      key: 'perfectFor'
    },
    {
      title: 'Advance',
      dataIndex: 'advanceAmount',
      key: 'advanceAmount',
      render: (a) => (a ? `₹${a}` : '-')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm title="Are you sure to delete this sub-service?" onConfirm={() => handleDelete(record._id)}>
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
        Sub-Services
      </Title>

      <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 20 }} onClick={() => setIsModalOpen(true)}>
        Add Sub-Service
      </Button>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table dataSource={subServices} columns={columns} rowKey="_id" bordered pagination={{ pageSize: 8 }} />
      )}

      <Modal
        title={editingSubService ? 'Edit Sub-Service' : 'Add Sub-Service'}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="Save"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="serviceId" label="Parent Service" rules={[{ required: true, message: 'Please select a service' }]}>
            <Select placeholder="Select a service">
              {services.map((s) => (
                <Option key={s._id} value={s._id}>
                  {s.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="name" label="Sub-Service Name" rules={[{ required: true, message: 'Please enter sub-service name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter a price' }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="advanceAmount" label="Advance Amount">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="time" label="Duration / Time" rules={[{ required: true, message: 'Please enter duration' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter description' }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="whatYouGet" label="What You Get" rules={[{ required: true, message: 'Please enter a price' }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="upgradeOption" label="Upgrade Option" rules={[{ required: true, message: 'Please enter a price' }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="perfectFor" label="Perfect For" rules={[{ required: true, message: 'Please enter a price' }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="image"
            label="Upload Image"
            valuePropName="fileList"
            rules={[{ required: editingSubService ? false : true, message: 'Please upload an image' }]}
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
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

export default SubServices;
