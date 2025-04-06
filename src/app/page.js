"use client";

import Map from "@/components/map";
import axios from "axios";
import Image from "next/image"; 
import Link from "next/link";
import React, { useState, useEffect, useCallback, useMemo } from "react";

// Main component definition
export default function Home() {
  // State declarations for managing incidents, form data, UI states etc
  const [incidents, setIncidents] = useState([]); // Stores list of all incidents
  const [editingId, setEditingId] = useState(null); // Tracks which incident is being edited
  const [formData, setFormData] = useState({ // Form data for creating/editing incidents
    suspects: "",
    suspectsDetails: "",
    incidentType: "", 
    incidentDetails: "",
    time: "",
    comment: ""
  });
  const [modalOpen, setModalOpen] = useState(false); // Controls image modal visibility
  const [selectedImage, setSelectedImage] = useState(""); // Stores currently viewed image URL
  const [notification, setNotification] = useState({ type: '', message: '' }); // Manages notification state
  const [isLoading, setIsLoading] = useState(false); // Tracks loading state

  // Effect to auto-hide notifications after 5 seconds
  useEffect(() => {
    if(notification.message) {
      const timer = setTimeout(() => {
        setNotification({ type: '', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Function to fetch all incidents from API
  const fetchIncidents = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("https://police-be.onrender.com/api/incidents/");
      setIncidents(data.incidents);
    } catch (err) {
      console.error("Error:", err);
      setNotification({ type: 'error', message: 'Failed to fetch incidents' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect to fetch incidents on component mount
  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  // Handler for opening image modal
  const handleViewImage = useCallback((imageUrl) => {
    setSelectedImage(imageUrl);
    setModalOpen(true);
  }, []);

  // Handler for closing image modal
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedImage("");
  }, []);

  // Handler for resolving an incident
  const handleResolve = useCallback(async (id) => {
    try {
      await axios.put(`https://police-be.onrender.com/api/incidents/edit/${id}`, { resolved: true });
      setIncidents(prev => prev.map(inc => 
        inc._id === id ? { ...inc, resolved: true } : inc
      ));
      setNotification({ type: 'success', message: 'Incident resolved successfully' });
    } catch (err) {
      console.error("Error:", err);
      setNotification({ type: 'error', message: 'Failed to resolve incident' });
    }
  }, []);

  // Handler for initiating incident edit
  const handleEdit = useCallback(({ _id, suspects, suspectsDetails, incidentType, incidentDetails, time, comment }) => {
    setEditingId(_id);
    setFormData({ suspects, suspectsDetails, incidentType, incidentDetails, time, comment });
  }, []);

  // Handler for updating an incident
  const handleUpdateIncident = useCallback(async () => {
    try {
      await axios.put(`https://police-be.onrender.com/api/incidents/edit/${editingId}`, formData);
      setIncidents(prev => prev.map(inc =>
        inc._id === editingId ? { ...inc, ...formData } : inc
      ));
      setEditingId(null);
      setFormData({
        suspects: "",
        suspectsDetails: "",
        incidentType: "",
        incidentDetails: "",
        time: "",
        comment: ""
      });
      setNotification({ type: 'success', message: 'Incident updated successfully' });
    } catch (err) {
      console.error("Error:", err);
      setNotification({ type: 'error', message: 'Failed to update incident' });
    }
  }, [editingId, formData]);

  // Handler for form input changes
  const handleInputChange = useCallback(({ target: { name, value } }) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Handler for canceling incident update
  const handleCancelUpdate = useCallback(() => {
    setEditingId(null);
    setFormData({
      suspects: "",
      suspectsDetails: "",
      incidentType: "",
      incidentDetails: "",
      time: "",
      comment: ""
    });
  }, []);

  // Memoized form fields configuration
  const formFields = useMemo(() => [
    { name: "suspects", label: "Suspect's Name" },
    { name: "suspectsDetails", label: "Suspect's Details" },
    { name: "incidentType", label: "Incident Type" },
    { name: "incidentDetails", label: "Incident Details" },
    { name: "time", label: "Time" },
    { name: "comment", label: "Comment" }
  ], []);

  // Memoized table headers configuration
  const tableHeaders = useMemo(() => [
    "Suspect's name", "Suspect's details", "Incident type", "Incident Details",
    "Submitted By","Incident Time", "Submitted Date", "Status", "Image", "Actions"
  ], []);

  // JSX for main layout
  return (
    // Main container with flex layout
    <div className="flex h-screen bg-white">
      {/* Notification component */}
      {notification.message && (
        <div className={`fixed top-4 right-4 p-4 rounded-md ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}
      {/* Sidebar navigation */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-lg font-bold text-gray-800 mb-8">Admin Panel</h1>
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

      {/* Main content area */}
      <div className="flex-1 p-8 flex flex-col">
        {/* Incidents table section */}
        <div className="bg-white rounded-lg shadow-lg p-6 h-[50vh] overflow-x-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {editingId ? "UPDATE INCIDENT DETAILS" : "INCIDENT DETAILS"}
          </h2>

          {/* Edit form */}
          {editingId && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              {formFields.map(({ name, label }) => (
                <React.Fragment key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </React.Fragment>
              ))}
              <div className="flex gap-2">
                <button onClick={handleUpdateIncident} 
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200">
                  Update Incident
                </button>
                <button onClick={handleCancelUpdate}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-200">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Loading spinner or incidents table */}
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <table className="table-auto w-full my-6 border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-200 text-left">
                  {tableHeaders.map(header => (
                    <th key={header} className="border border-gray-400 px-4 py-2">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident._id}>
                    <td className="border border-gray-400 px-4 py-2">{incident.suspects}</td>
                    <td className="border border-gray-400 px-4 py-2">{incident.suspectsDetails}</td>
                    <td className="border border-gray-400 px-4 py-2">{incident.incidentType}</td>
                    <td className="border border-gray-400 px-4 py-2">{incident.incidentDetails}</td>
                    <td className="border border-gray-400 px-4 py-2">{incident.submittedBy}</td>
                    <td className="border border-gray-400 px-4 py-2">{incident.time}</td>
                    <td className="border border-gray-400 px-4 py-2">
                      {new Date(incident.updatedAt).toLocaleString()}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      <span className={incident.resolved ? "text-green-500" : "text-red-500"}>
                        {incident.resolved ? "Resolved" : "Pending"}
                      </span>
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {incident.image ? (
                        <span onClick={() => handleViewImage(incident.image)} 
                              className="text-blue-500 hover:text-blue-400 cursor-pointer">
                          View
                        </span>
                      ) : "No Image"}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      <div className="flex items-center gap-2 justify-center">
                        {!incident.resolved && (
                          <button onClick={() => handleResolve(incident._id)}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md">
                            Resolve
                          </button>
                        )}
                        <button onClick={() => handleEdit(incident)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Map component */}
        <div className="h-[50vh] z-40">
          <Map incidents={incidents} />
        </div>
      </div>
      {/* Image modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Incident Image</h2>
            <div className="relative w-full max-h-[1000px]">
              <Image
                src={selectedImage}
                alt="Incident"
                layout="intrinsic"
                width={500}
                height={1000}
                objectFit="contain"
              />
            </div>
            <button onClick={handleCloseModal} 
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
