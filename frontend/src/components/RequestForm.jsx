import React, { useState } from 'react';
import api from '../services/api';

function RequestForm() {
  const [form, setForm] = useState({ hospital_id: '', blood_group: '', quantity: '' });
  const handleSubmit = e => {
    e.preventDefault();
    api.post('/request', form)
      .then(res => alert('Request submitted: ' + JSON.stringify(res.data)))
      .catch(err => {
        console.error(err);
        alert('Error: ' + (err.response?.data?.error || err.message));
      });
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Hospital Request</h2>
      <div><input placeholder="Hospital ID (use user id)" required onChange={e => setForm({ ...form, hospital_id: e.target.value })} /></div>
      <div><input placeholder="Blood Group" required onChange={e => setForm({ ...form, blood_group: e.target.value })} /></div>
      <div><input placeholder="Quantity" type="number" required onChange={e => setForm({ ...form, quantity: e.target.value })} /></div>
      <div><button type="submit">Submit Request</button></div>
    </form>
  );
}

export default RequestForm;
