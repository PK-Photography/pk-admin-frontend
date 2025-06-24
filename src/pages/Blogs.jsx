import React, { useState, useEffect } from "react";
import axiosInstance from 'utils/axiosInstance';
import { toast } from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const BlogAdminPanel = () => {
  const [blogs, setBlogs] = useState([]);
  const [open, setOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [selectedId, setSelectedId] = useState(null);
  const [blogData, setBlogData] = useState({
    title: "",
    subtitle: "",
    content: "",
    author: "",
    date: "",
    image: "",
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axiosInstance.get("/blogs");
      setBlogs(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch blogs");
    }
  };

  const handleChange = (e) => {
    setBlogData({ ...blogData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (formMode === "add") {
        await axiosInstance.post("/blogs", blogData);
        toast.success("Blog created");
      } else {
        await axiosInstance.put(`/blogs/${selectedId}`, blogData);
        toast.success("Blog updated");
      }
      fetchBlogs();
      setOpen(false);
      setBlogData({
        title: "",
        subtitle: "",
        content: "",
        author: "",
        date: "",
        image: "",
      });
    } catch (err) {
      toast.error("Failed to save blog");
    }
  };

  const handleEdit = (blog) => {
    setFormMode("edit");
    setSelectedId(blog._id);
    setBlogData(blog);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/blogs/${id}`);
      toast.success("Blog deleted");
      fetchBlogs();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif", background: "#f9f9f9", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", background: "#fff", padding: "30px", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>Manage Blogs</h2>
          <button
            onClick={() => {
              setOpen(true);
              setFormMode("add");
              setBlogData({
                title: "",
                subtitle: "",
                content: "",
                author: "",
                date: "",
                image: "",
              });
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Add Blog
          </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "40px" }}>
          <thead style={{ backgroundColor: "#f2f2f2" }}>
            <tr>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Author</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(blogs) && blogs.map((blog) => (
              <tr key={blog._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={tdStyle}>{blog.title}</td>
                <td style={tdStyle}>{blog.author}</td>
                <td style={tdStyle}>{blog.date}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleEdit(blog)} style={{ color: "#007BFF", marginRight: "10px", cursor: "pointer", background: "none", border: "none" }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(blog._id)} style={{ color: "#dc3545", cursor: "pointer", background: "none", border: "none" }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {open && (
          <div>
            <h3 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "20px" }}>
              {formMode === "add" ? "Add New Blog" : "Edit Blog"}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={blogData.title}
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                type="text"
                name="subtitle"
                placeholder="Subtitle"
                value={blogData.subtitle}
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                type="text"
                name="author"
                placeholder="Author"
                value={blogData.author}
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                type="date"
                name="date"
                value={blogData.date}
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={blogData.image}
                onChange={handleChange}
                style={inputStyle}
              />
              <div>
                <ReactQuill
                  value={blogData.content}
                  onChange={(val) => setBlogData({ ...blogData, content: val })}
                  style={{ backgroundColor: "#fff", borderRadius: "6px" }}
                  placeholder="Write your blog content..."
                />
              </div>
              <button
                onClick={handleSubmit}
                style={{
                  marginTop: "20px",
                  padding: "12px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                {formMode === "add" ? "Create Blog" : "Update Blog"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const thStyle = {
  padding: "12px",
  textAlign: "left",
  fontWeight: "bold",
  fontSize: "14px",
  borderBottom: "1px solid #ccc"
};

const tdStyle = {
  padding: "12px",
  fontSize: "14px",
  color: "#333"
};

const inputStyle = {
  padding: "12px",
  fontSize: "14px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  width: "100%"
};

export default BlogAdminPanel;