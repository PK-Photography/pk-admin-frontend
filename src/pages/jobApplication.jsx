import React, { useEffect, useState } from "react";
import axiosInstance from "utils/axiosInstance";
import { Table, Tag, Button, Select, Typography, Spin, message, Card } from "antd";

const { Title } = Typography;
const { Option } = Select;

const JobApplication = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const response = await axiosInstance.get("/careers");
      setApplications(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      message.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const fetchResume = async (resumeUrl) => {
    try {
      const encodedUrl = encodeURIComponent(resumeUrl);
      const response = await axiosInstance.get(`/careers/resume-url/${encodedUrl}`);
      return response.data.signedUrl;
    } catch (err) {
      console.error("Error fetching signed URL:", err);
      message.error("Could not fetch resume");
      return null;
    }
  };

  const handleViewResume = async (resumeKey) => {
    if (!resumeKey) return;
    const url = await fetchResume(resumeKey);
    if (url) window.open(url, "_blank");
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/careers/${id}/status`, { status: newStatus });
      message.success("Status updated successfully");
      fetchApplications();
    } catch (err) {
      console.error("Failed to update status:", err);
      message.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Resume",
      dataIndex: "resumeUrl",
      key: "resume",
      render: (resumeUrl) =>
        resumeUrl ? (
          <Button type="link" onClick={() => handleViewResume(resumeUrl)}>
            View Resume
          </Button>
        ) : (
          <span style={{ color: "#999" }}>No Resume</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "gold";
        if (status === "approved") color = "green";
        else if (status === "rejected") color = "red";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Change Status",
      key: "changeStatus",
      render: (_, record) => (
        <Select
          value={record.status}
          style={{ width: 120 }}
          onChange={(value) => updateStatus(record._id, value)}
        >
          <Option value="pending">Pending</Option>
          <Option value="approved">Approved</Option>
          <Option value="rejected">Rejected</Option>
        </Select>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
        <p style={{ marginTop: 10 }}>Loading applications...</p>
      </div>
    );
  }

  return (
    <Card style={{ margin: 20 }}>
      <Title level={3} style={{ marginBottom: 20 }}>
        Career Applications
      </Title>
      <Table
        columns={columns}
        dataSource={applications}
        rowKey="_id"
        bordered
        pagination={{ pageSize: 8 }}
      />
    </Card>
  );
};

export default JobApplication;
