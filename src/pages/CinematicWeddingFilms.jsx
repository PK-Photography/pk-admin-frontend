import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message, Space, Card, Typography, Popconfirm, Select } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import axiosInstance from 'utils/axiosInstance';

const { Title } = Typography;

const CinematicWeddingFilms = () => {
  const [data, setData] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [form] = Form.useForm();

  // ================= FETCH =================

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/cinematic-weddings');
      setData(res.data || []);
    } catch (err) {
      console.error(err);
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await axiosInstance.get('/cards');
      setClients(res.data || []);
    } catch (err) {
      console.error(err);
      message.error('Failed to fetch clients');
    }
  };

  useEffect(() => {
    fetchData();
    fetchClients();
  }, []);

  // ================= CREATE / UPDATE =================

  const handleSave = async (values) => {
    const formData = new FormData();

    formData.append('name', values.name);
    formData.append('client', values.client);
    formData.append('subHeading', values.subHeading || '');

    if (values.image?.length > 0) {
      formData.append('file', values.image[0].originFileObj);
    }

    try {
      if (editingItem) {
        await axiosInstance.put(`/cinematic-weddings/${editingItem._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        message.success('Updated successfully');
      } else {
        await axiosInstance.post('/cinematic-weddings', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('Created successfully');
      }

      fetchData();
      handleCancel();
    } catch (err) {
      console.error(err);
      message.error('Save failed');
    }
  };

  // ================= DELETE =================

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/cinematic-weddings/${id}`);
      message.success('Deleted successfully');
      fetchData();
    } catch (err) {
      console.error(err);
      message.error('Delete failed');
    }
  };

  // ================= EDIT =================

  const handleEdit = (record) => {
    setEditingItem(record);

    form.setFieldsValue({
      name: record.name,
      subHeading: record.subHeading,
      client: record.client
    });

    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    form.resetFields();
  };

  // ================= TABLE =================

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      render: (url) => (url ? <img src={url} alt="preview" style={{ width: 80, borderRadius: 6 }} /> : '-')
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text) => <b>{text}</b>
    },
    {
      title: 'Sub Heading',
      dataIndex: 'subHeading'
    },
    {
      title: 'Client',
      dataIndex: 'client',
      render: (id) => {
        const client = clients.find((c) => c._id === id);
        return client ? client.name : id;
      }
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record)}>
            Edit
          </Button>

          <Popconfirm title="Delete this record?" onConfirm={() => handleDelete(record._id)}>
            <Button danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // ================= UI =================

  return (
    <div style={{ padding: 24, background: '#f5f7fa', minHeight: '100vh' }}>
      <Card style={{ borderRadius: 12 }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 20
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            🎬 Cinematic Wedding Films
          </Title>

          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Add Film
          </Button>
        </div>

        {/* Table */}
        <Table rowKey="_id" columns={columns} dataSource={data} loading={loading} />
      </Card>

      {/* Modal */}
      <Modal title={editingItem ? 'Edit Film' : 'Create Film'} open={isModalOpen} onCancel={handleCancel} footer={null} width={600}>
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Enter name' }]}>
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item name="subHeading" label="Sub Heading">
            <Input placeholder="Enter sub heading" />
          </Form.Item>

          <Form.Item name="client" label="Select Client" rules={[{ required: true, message: 'Select client' }]}>
            <Select showSearch placeholder="Search client" optionFilterProp="children">
              {clients.map((c) => (
                <Select.Option key={c._id} value={c._id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="image"
            label="Upload Image"
            required={editingItem ? false : true}
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload.Dragger beforeUpload={() => false} maxCount={1}>
              <UploadOutlined />
              <p>Click or drag file</p>
            </Upload.Dragger>
          </Form.Item>

          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CinematicWeddingFilms;
