import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message, Space, Card, Typography, Popconfirm, Spin, Tabs } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import axiosInstance from 'utils/axiosInstance';

const { Title } = Typography;
const { TabPane } = Tabs;

const Talent = () => {
  const [talents, setTalents] = useState([]);
  const [pendingTalents, setPendingTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTalent, setEditingTalent] = useState(null);
  const [form] = Form.useForm();

  // Fetch approved + pending talents
  const fetchTalents = async () => {
    try {
      setLoading(true);
      const approvedRes = await axiosInstance.get('/talents/approved');
      const pendingRes = await axiosInstance.get('/talents/unapproved');
      setTalents(approvedRes.data);
      setPendingTalents(pendingRes.data);
    } catch (err) {
      console.error('Error fetching talents:', err);
      message.error('Failed to fetch talents');
    } finally {
      setLoading(false);
    }
  };

  // Save talent (create/update)
  const handleSave = async (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('phone', values.phone);
    formData.append('city', values.city);
    formData.append('talent', values.talent);
    formData.append('message', values.message);
    formData.append('approved', true);
    if (values.portfolioUrl) formData.append('portfolioUrl', values.portfolioUrl);
    if (values.experience) formData.append('experience', values.experience);
    if (values.image && values.image.length > 0) {
      formData.append('image', values.image[0].originFileObj);
    }

    try {
      if (editingTalent) {
        await axiosInstance.put(`/talents/${editingTalent._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('Talent updated successfully');
      } else {
        await axiosInstance.post('/talents', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('Talent created successfully');
      }
      fetchTalents();
      setIsModalOpen(false);
      setEditingTalent(null);
      form.resetFields();
    } catch (err) {
      console.error('Error saving talent:', err);
      message.error('Failed to save talent');
    }
  };

  // Delete talent
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/talents/${id}`);
      message.success('Talent deleted successfully');
      fetchTalents();
    } catch (err) {
      console.error('Delete failed:', err);
      message.error('Failed to delete talent');
    }
  };

  // Approve talent
  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(`/talents/changeStatus/${id}`, { approved: true });
      message.success('Talent approved');
      fetchTalents();
    } catch (err) {
      console.error('Approve failed:', err);
      message.error('Failed to approve talent');
    }
  };

  const handleUnapprove = async (id) => {
    try {
      await axiosInstance.put(`/talents/changeStatus/${id}`, { approved: false });
      message.success('Talent Unapproved');
      fetchTalents();
    } catch (err) {
      console.error('UnApproval failed:', err);
      message.error('Failed to Unapprove talent');
    }
  };

  // Open modal for edit
  const handleEdit = (record) => {
    setEditingTalent(record);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      phone: record.phone,
      city: record.city,
      talent: record.talent,
      portfolioUrl: record.portfolioUrl,
      experience: record.experience,
      message: record.message
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingTalent(null);
    form.resetFields();
  };

  useEffect(() => {
    fetchTalents();
  }, []);

  const commonColumns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (img) =>
        img ? (
          <img
            src={img}
            alt="talent"
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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (text ? <b>{text}</b> : '-')
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'City', dataIndex: 'city', key: 'city' },
    { title: 'Talent', dataIndex: 'talent', key: 'talent' },
    { title: 'Experience', dataIndex: 'experience', key: 'experience' },
    {
      title: 'Portfolio',
      dataIndex: 'portfolioUrl',
      key: 'portfolioUrl',
      render: (url) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            View
          </a>
        ) : (
          '-'
        )
    },
    { title: 'Message', dataIndex: 'message', key: 'message' }
  ];

  const approvedColumns = [
    ...commonColumns,
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" onClick={() => handleUnapprove(record._id)}>
            Unapprove
          </Button>
          <Popconfirm title="Are you sure to delete this talent?" onConfirm={() => handleDelete(record._id)}>
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const pendingColumns = [
    ...commonColumns,
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" onClick={() => handleApprove(record._id)}>
            Approve
          </Button>
          <Popconfirm title="Are you sure to delete this talent?" onConfirm={() => handleDelete(record._id)}>
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
        Talents
      </Title>

      <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 20 }} onClick={() => setIsModalOpen(true)}>
        Add Talent
      </Button>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Approved Talents" key="1">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <Spin size="large" />
            </div>
          ) : (
            <Table dataSource={talents} columns={approvedColumns} rowKey="_id" bordered pagination={{ pageSize: 8 }} />
          )}
        </TabPane>
        <TabPane tab="Pending Talents" key="2">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <Spin size="large" />
            </div>
          ) : (
            <Table dataSource={pendingTalents} columns={pendingColumns} rowKey="_id" bordered pagination={{ pageSize: 8 }} />
          )}
        </TabPane>
      </Tabs>

      {/* Modal for Add/Edit */}
      <Modal
        title={editingTalent ? 'Edit Talent' : 'Add Talent'}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="Save"
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true, message: 'Please enter name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'Please enter phone' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="city" label="City" rules={[{ required: true, message: 'Please enter city' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="talent" label="Talent" rules={[{ required: true, message: 'Please enter talent' }]}>
            <Input placeholder="e.g. Fashion Model, Bridal Model" />
          </Form.Item>
          <Form.Item name="experience" label="Experience">
            <Input placeholder="e.g., 3 years" />
          </Form.Item>
          <Form.Item name="portfolioUrl" label="Portfolio URL">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="message" label="Message" rules={[{ required: true, message: 'Please enter message' }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="image"
            label="Upload Image"
            valuePropName="fileList"
            rules={editingTalent ? [] : [{ required: true, message: 'Please upload image' }]}
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

export default Talent;
