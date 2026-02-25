import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message, Space, Card, Typography, Popconfirm, DatePicker, Select } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import axiosInstance from 'utils/axiosInstance';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const ShaadiFilmsAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [users, setUsers] = useState([]);

  const [form] = Form.useForm();

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/user/all');
      setUsers(res.data || []);
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch users');
    }
  };

  // Fetch albums
  const fetchAlbums = async (pageNo = 1) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/albums?page=${pageNo}`);
      setAlbums(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
      message.error('Failed to fetch albums');
    } finally {
      setLoading(false);
    }
  };

  // Create / Update album
  const handleSave = async (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('userId', values.userId);
    formData.append('event_date', values.event_date.toISOString());

    if (values.file?.length > 0) {
      formData.append('file', values.file[0].originFileObj);
    }

    try {
      if (editingAlbum) {
        await axiosInstance.put(`/albums/${editingAlbum._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        message.success('Album updated successfully');
      } else {
        await axiosInstance.post('/albums', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        message.success('Album created successfully');
      }

      fetchAlbums(page);
      handleCancel();
    } catch (err) {
      console.error(err);
      message.error('Failed to save album');
    }
  };

  // Delete album
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/albums/${id}`);
      message.success('Album deleted');
      fetchAlbums(page);
    } catch (err) {
      console.error(err);
      message.error('Delete failed');
    }
  };

  // Edit album
  const handleEdit = (record) => {
    setEditingAlbum(record);
    form.setFieldsValue({
      name: record.name,
      userId: record.userId,
      event_date: record.event_date ? dayjs(record.event_date) : null
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingAlbum(null);
    form.resetFields();
  };

  useEffect(() => {
    fetchAlbums(page);
    fetchUsers();
  }, [page]);

  const columns = [
    {
      title: 'Album ID',
      dataIndex: '_id',
      key: '_id',
      width: 220,
      render: (id) => <span style={{ fontSize: 12 }}>{id}</span>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 220
    },
    {
      title: 'Preview',
      dataIndex: 'url',
      key: 'url',
      render: (url) =>
        url ? (
          <Button type="link" href={url} target="_blank" size="small">
            View File
          </Button>
        ) : (
          <span style={{ color: '#bbb' }}>No File</span>
        )
    },
    {
      title: 'Album Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <b>{text}</b>
    },
    {
      title: 'Event Date',
      dataIndex: 'event_date',
      key: 'event_date',
      render: (date) => (date ? dayjs(date).format('DD MMM YYYY') : '-')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="default" size="small" onClick={() => handleEdit(record)}>
            Edit
          </Button>

          <Popconfirm title="Delete this album?" onConfirm={() => handleDelete(record._id)}>
            <Button danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24, background: '#f5f7fa', minHeight: '100vh' }}>
      <Card
        style={{
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}
        bodyStyle={{ padding: 24 }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            🎬 ShaadiFilms Albums
          </Title>

          <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Add Album
          </Button>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={albums}
          rowKey="_id"
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={{
            current: page,
            total,
            pageSize: 20,
            showSizeChanger: false,
            onChange: (p) => setPage(p)
          }}
          bordered={false}
          style={{ borderRadius: 8 }}
        />
      </Card>

      {/* Modal */}
      <Modal
        title={<span style={{ fontSize: 18, fontWeight: 600}}>{editingAlbum ? 'Edit Album' : 'Create New Album'}</span>}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={650}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: 12 }}>
          <Form.Item name="name" label="Album Name" rules={[{ required: true, message: 'Please enter album name' }]}>
            <Input size="large" placeholder="Enter album name" />
          </Form.Item>

          <Form.Item name="event_date" label="Event Date" rules={[{ required: true, message: 'Please select event date' }]}>
            <DatePicker size="large" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="userId"
            label={
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Select User</span>
                <Link
                  to="/user-management"
                  style={{
                    fontSize: 13,
                    textDecoration: 'underline',
                    padding: '2px 6px',
                  }}
                >
                   Create New User
                </Link>
              </div>
            }
            rules={[{ required: true, message: 'Please select user' }]}
          >
            <Select size="large" placeholder="Search & select user" showSearch optionFilterProp="children">
              {users.map((user) => (
                <Select.Option key={user.id} value={user.id}>
                  {user.fullName} ({user.email})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="file"
            label="Upload File"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            rules={editingAlbum ? [] : [{ required: true, message: 'Please upload a file' }]}
          >
            <Upload.Dragger beforeUpload={() => false} maxCount={1}>
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ fontSize: 24 }} />
              </p>
              <p>Click or drag file to upload</p>
            </Upload.Dragger>
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 20 }}>
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingAlbum ? 'Update Album' : 'Create Album'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ShaadiFilmsAlbums;
