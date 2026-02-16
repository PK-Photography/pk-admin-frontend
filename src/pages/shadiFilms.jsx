import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message, Space, Card, Typography, Popconfirm, Spin, DatePicker } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import axiosInstance from 'utils/axiosInstance';

const { Title } = Typography;

const ShaadiFilmsAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const user = localStorage.getItem("user");

  const [form] = Form.useForm();



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
    if(user) formData.append('userId', user._id);
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
  }, [page]);

  const columns = [
    {
      title: 'Preview',
      dataIndex: 'url',
      key: 'url',
      render: (url) =>
        url ? (
          <a href={url} target="_blank" rel="noreferrer">
            View File
          </a>
        ) : (
          <span style={{ color: '#999' }}>No File</span>
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
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm title="Delete this album?" onConfirm={() => handleDelete(record._id)}>
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
      <Title level={3}>ShaadiFilms Albums</Title>

      <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 20 }} onClick={() => setIsModalOpen(true)}>
        Add Album
      </Button>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={albums}
          rowKey="_id"
          bordered
          pagination={{
            current: page,
            total,
            pageSize: 20,
            onChange: (p) => setPage(p)
          }}
        />
      )}

      <Modal
        title={editingAlbum ? 'Edit Album' : 'Add Album'}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="Save"
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="name" label="Album Name" rules={[{ required: true, message: 'Please enter album name' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="event_date" label="Event Date" rules={[{ required: true, message: 'Please select event date' }]}>
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="file"
            label="Upload File"
            valuePropName="fileList"
            required={editingAlbum ? false : true}
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ShaadiFilmsAlbums;
