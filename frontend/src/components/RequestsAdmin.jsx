import React, { useEffect, useState } from 'react';
import api from '../services/api';

function RequestsAdmin() {
  const [requests, setRequests] = useState([]);

  const load = () => api.get('/requests').then(res => setRequests(res.data)).catch(err => console.error(err));
  useEffect(() => { load(); }, []);

  const changeStatus = (id, status) => {
    api.put(`/request/${id}/status`, { status })
      .then(res => {
        alert(res.data.message);
        load();
      })
      .catch(err => alert('Error: ' + (err.response?.data?.error || err.message)));
  };

  return (
    <div>
      <h2>Requests (Admin)</h2>
      <table border="1" cellPadding="6">
        <thead><tr><th>ID</th><th>Hospital</th><th>BG</th><th>Qty</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {requests.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.hospital_name}</td>
              <td>{r.blood_group}</td>
              <td>{r.quantity}</td>
              <td>{r.status}</td>
              <td>
                <button onClick={() => changeStatus(r.id, 'approved')}>Approve</button>
                <button onClick={() => changeStatus(r.id, 'rejected')}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RequestsAdmin;
