import React, { useState } from 'react';
import api from '../services/api';

function RegisterForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'donor', blood_group: '', location: '' });

  const handleSubmit = e => {
    e.preventDefault();
    api.post('/register', form)
      .then(res => alert('Registered: ' + JSON.stringify(res.data)))
      .catch(err => {
        console.error(err);
        alert('Error: ' + (err.response?.data?.error || err.message));
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <div><input placeholder="Name" required onChange={e => setForm({ ...form, name: e.target.value })} /></div>
      <div><input placeholder="Email" type="email" required onChange={e => setForm({ ...form, email: e.target.value })} /></div>
      <div><input placeholder="Password" type="password" required onChange={e => setForm({ ...form, password: e.target.value })} /></div>
      <div>
        <select onChange={e => setForm({ ...form, role: e.target.value })} value={form.role}>
          <option value="donor">Donor</option>
          <option value="hospital">Hospital</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div><input placeholder="Blood Group (optional)" onChange={e => setForm({ ...form, blood_group: e.target.value })} /></div>
      <div><input placeholder="Location (optional)" onChange={e => setForm({ ...form, location: e.target.value })} /></div>
      <div><button type="submit">Register</button></div>
    </form>
  );
}

export default RegisterForm;
