"use client";

import axios from "axios";
import Link from "next/link";
import React from "react";

export default function Notices() {
  const [notices, setNotices] = React.useState([]);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [editingId, setEditingId] = React.useState(null);
  const [alert, setAlert] = React.useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = React.useState(true);

  const fetchNotices = async () => {
    try {
      const response = await axios.get("https://police-be.onrender.com/api/notices/");
      setNotices(response.data.notices);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notices:", error);
      setLoading(false);
    }
  };
  React.useEffect(() => {
    fetchNotices();
  }, []);

  const handleSendNotice = async () => {
    try {
      if (editingId) {
        const response = await axios.put(
          `https://police-be.onrender.com/api/notices/edit/${editingId}`,
          { title, description }
        );
        if (response.status === 200) {
          setNotices((prevNotices) =>
            prevNotices.map((notice) =>
              notice._id === editingId
                ? { ...notice, title, description }
                : notice
            )
          );
          fetchNotices();
          setEditingId(null);
          setTitle("");
          setDescription("");
          setAlert({
            show: true,
            message: "Notice updated successfully!",
            type: "success"
          });
        }
      } else {
        const response = await axios.post(
          "https://police-be.onrender.com/api/notices/create-notice",
          { title, description }
        );
        if (response.status === 201 || response.status === 200) {
          console.log("Notice created successfully:", response.data);
          setAlert({
            show: true,
            message: "Notice created successfully!",
            type: "success"
          });
          setTitle("");
          setDescription("");
          fetchNotices();
        } else {
          console.log("Error creating notice:", response.data);
          setAlert({
            show: true,
            message: "Error creating notice",
            type: "error"
          });
        }
      }
    } catch (error) {
      console.log("Error sending notice:", error);
      setAlert({
        show: true,
        message: "Error sending notice",
        type: "error"
      });
    }
    
    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleEdit = (notice) => {
    setTitle(notice.title);
    setDescription(notice.description);
    setEditingId(notice._id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Admin Panel</h1>
          <nav>
            <Link href="/" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500 hover:text-white">
              INCIDENTS
            </Link>
            <Link href="/notices" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500 hover:text-white">
              NOTICES
            </Link>
          </nav>
        </div>
      </div>

      <div className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {alert.show && (
            <div className={`mb-4 p-4 rounded ${alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {alert.message}
            </div>
          )}
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {editingId ? "EDIT NOTICE" : "SEND NOTICE"}
          </h2>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <button 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={handleSendNotice}
            >
              {editingId ? "UPDATE NOTICE" : "SEND NOTICE"}
            </button>
            {editingId &&<button 
              className="m-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={handleCancelEdit}
            >
               Cancel Update
            </button>}
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-6">NOTICES LIST</h2>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r border-gray-200">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r border-gray-200">Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r border-gray-200">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {notices.map((notice) => (
                    <tr key={notice._id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 border-r border-gray-200">
                        {notice.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 border-r border-gray-200">
                        {notice.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 border-r border-gray-200">
                        {new Date(notice.updatedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === notice._id ? (
                          <div className="space-x-2">
                            <button
                              className="text-red-600 hover:text-red-900 font-medium"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            className="text-blue-600 hover:text-blue-900 font-medium"
                            onClick={() => handleEdit(notice)}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
