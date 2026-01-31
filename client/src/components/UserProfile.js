import React, { useState, useEffect } from 'react';

const UserProfile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch user profile data from backend with JWT
    const token = localStorage.getItem('token');
    fetch('/api/user/profile', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    })
      .then(res => res.json())
      .then(data => {
        setFormData({
          fullName: data.fullName || '',
          username: data.username || '',
          email: data.email || '',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('token');
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ fullName: formData.fullName }),
    });
    const data = await res.json();
    if (res.ok) setMessage('Profile updated successfully!');
    else setMessage(data.error || 'Update failed');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      {message && <div className="mb-2 text-green-600">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            disabled
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
