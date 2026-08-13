import React, { useEffect, useState } from 'react';
import api from '../services/api';

function InventoryView() {
  const [inv, setInv] = useState([]);
  const [group, setGroup] = useState('');
  const [units, setUnits] = useState('');

  useEffect(() => {
    api.get('/inventory').then(res => setInv(res.data)).catch(err => console.error(err));
  }, []);

  const handleUpdate = e => {
    e.preventDefault();
    if(!group) return alert('Enter blood group');
    api.put(`/inventory/${encodeURIComponent(group)}`, { units: Number(units) })
      .then(() => {
        alert('Inventory updated');
        return api.get('/inventory');
      })
      .then(res => setInv(res.data))
      .catch(err => {
        console.error(err);
        alert('Error: ' + (err.response?.data?.error || err.message));
      });
  };

  return (
    <div>
      <h2>Inventory</h2>
      <ul>
        {inv.map(i => <li key={i.blood_group}>{i.blood_group} — {i.units_available} units</li>)}
      </ul>

      <h3>Adjust Inventory</h3>
      <form onSubmit={handleUpdate}>
        <input placeholder="Blood group" onChange={e => setGroup(e.target.value)} />
        <input placeholder="Units" type="number" onChange={e => setUnits(e.target.value)} />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default InventoryView;
