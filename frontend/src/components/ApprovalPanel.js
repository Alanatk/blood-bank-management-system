import React, { useEffect, useState } from "react";
import api from "../services/api";

function ApprovalPanel() {
  const [requests, setRequests] = useState([]);

  // Load all requests from backend
  const fetchRequests = () => {
    api
      .get("/requests") // ✅ Works with baseURL from api.js
      .then((res) => setRequests(res.data))
      .catch((err) => {
        console.error(err);
        alert("Error loading requests!");
      });
  };

  useEffect(() => {
    fetchRequests(); // Load when page opens
  }, []);

  // Approve request
  const handleApprove = (id) => {
    api
      .put(`/request/${id}/status`, { status: "approved" })
      .then(() => {
        alert("✅ Request Approved!");
        fetchRequests(); // Reload table after update
      })
      .catch((err) => {
        console.error(err);
        alert("Error approving request!");
      });
  };

  // Reject request
  const handleReject = (id) => {
    api
      .put(`/request/${id}/status`, { status: "rejected" })
      .then(() => {
        alert("❌ Request Rejected!");
        fetchRequests(); // Reload table after update
      })
      .catch((err) => {
        console.error(err);
        alert("Error rejecting request!");
      });
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-rose-600 mb-4 flex items-center">
        🩸 Blood Request Approval Panel
      </h2>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-pink-400 to-red-400 text-white">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Hospital ID</th>
              <th className="py-3 px-4 text-left">Blood Group</th>
              <th className="py-3 px-4 text-left">Quantity</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr
                key={req.id}
                className="border-t hover:bg-rose-50 transition duration-200"
              >
                <td className="py-2 px-4">{req.id}</td>
                <td className="py-2 px-4">{req.hospital_id}</td>
                <td className="py-2 px-4">{req.blood_group}</td>
                <td className="py-2 px-4">{req.quantity}</td>
                <td className="py-2 px-4 capitalize font-semibold">
                  {req.status}
                </td>
                <td className="py-2 px-4">
                  {req.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500 italic">
                      {req.status.toUpperCase()}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ApprovalPanel;
