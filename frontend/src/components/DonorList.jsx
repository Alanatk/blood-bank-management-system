import React, { useEffect, useState } from "react";
import axios from "axios";

function DonorList() {
  const [donors, setDonors] = useState([]);
  const [editingDonor, setEditingDonor] = useState(null);
  const [form, setForm] = useState({
    blood_group: "",
    location: "",
    last_donation_date: "",
  });

  // Fetch donor data
  const fetchDonors = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/donors`);
      setDonors(res.data);
    } catch (err) {
      console.error("Error fetching donors:", err);
      alert("⚠️ Unable to fetch donor data. Check your backend connection.");
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  // Input change handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Edit button clicked
  const handleEdit = (donor) => {
    setEditingDonor(donor);
    setForm({
      blood_group: donor.blood_group,
      location: donor.location,
      last_donation_date: donor.last_donation_date
        ? donor.last_donation_date.split("T")[0]
        : "",
    });
  };

  // Save updated donor
  const handleSave = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/donors/${editingDonor.id}`,
        form
      );
      alert("✅ Donor updated successfully!");
      setEditingDonor(null);
      fetchDonors();
    } catch (err) {
      console.error("Error updating donor:", err);
      alert("❌ Failed to update donor.");
    }
  };

  // Delete donor
  const handleDelete = async (id) => {
    if (!window.confirm("🩸 Are you sure you want to delete this donor?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/donors/${id}`);
      alert("🗑️ Donor deleted successfully!");
      fetchDonors();
    } catch (err) {
      console.error("Error deleting donor:", err);
      alert("❌ Failed to delete donor.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-primary mb-4 text-center">
        🩸 Donor List
      </h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-primary text-white">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Blood Group</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-left">Last Donation</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {donors.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-4 text-gray-600 italic"
                >
                  No donors found.
                </td>
              </tr>
            ) : (
              donors.map((d) => (
                <tr
                  key={d.id}
                  className="border-b hover:bg-gray-50 transition-all"
                >
                  <td className="px-4 py-2">{d.name}</td>

                  {editingDonor && editingDonor.id === d.id ? (
                    <>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          name="blood_group"
                          value={form.blood_group}
                          onChange={handleChange}
                          className="border rounded-md px-2 py-1 w-20"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          name="location"
                          value={form.location}
                          onChange={handleChange}
                          className="border rounded-md px-2 py-1"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="date"
                          name="last_donation_date"
                          value={form.last_donation_date}
                          onChange={handleChange}
                          className="border rounded-md px-2 py-1"
                        />
                      </td>
                      <td className="px-4 py-2 text-center space-x-2">
                        <button
                          onClick={handleSave}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingDonor(null)}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-md"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2">{d.blood_group || "—"}</td>
                      <td className="px-4 py-2">{d.location || "—"}</td>
                      <td className="px-4 py-2">
                        {d.last_donation_date
                          ? d.last_donation_date.split("T")[0]
                          : "N/A"}
                      </td>
                      <td className="px-4 py-2 text-center space-x-2">
                        <button
                          onClick={() => handleEdit(d)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(d.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DonorList;
