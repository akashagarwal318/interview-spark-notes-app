import React, { useEffect, useState } from 'react';
import ApiService from '../services/api.js';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useSelector(s=>s.auth);
  const [users,setUsers]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);
  const [creating,setCreating]=useState(false);
  const [form,setForm]=useState({ name:'', email:'', password:'' });

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ApiService.get('/admin/users');
      setUsers(res.data?.users||res.users||[]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ loadUsers(); },[]);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role!=='admin') return <Navigate to="/" replace />;
  const isSelf = (u) => u.email?.toLowerCase() === user?.email?.toLowerCase();
  const isAdminAccount = (u) => u.role === 'admin';

  const onChangeRole = async (u, role) => {
    if (isSelf(u) && role !== 'admin') {
      alert('You cannot change your own role away from admin.');
      return;
    }
    const old = u.role;
    setUsers(prev => prev.map(x => x._id===u._id? { ...x, role } : x));
    try { await ApiService.patch(`/admin/users/${u._id}/role`, { role }); }
    catch (e) { setUsers(prev => prev.map(x => x._id===u._id? { ...x, role: old } : x)); alert(e.message); }
  };

  const onChangeStatus = async (u, status) => {
    if (isAdminAccount(u) && status !== 'active') {
      alert('Admin accounts must remain active and cannot be disabled or set to pending.');
      return;
    }
    const old = u.status;
    setUsers(prev => prev.map(x => x._id===u._id? { ...x, status } : x));
    try { await ApiService.patch(`/admin/users/${u._id}/status`, { status }); }
    catch (e) { setUsers(prev => prev.map(x => x._id===u._id? { ...x, status: old } : x)); alert(e.message); }
  };

  const onToggleFeature = async (u, key, value) => {
    const ff = { ...(u.featureFlags||{}) };
    const old = !!ff[key];
    ff[key] = value;
    setUsers(prev => prev.map(x => x._id===u._id? { ...x, featureFlags: ff } : x));
    try { await ApiService.patch(`/admin/users/${u._id}/features`, { featureFlags: { [key]: value } }); }
    catch (e) { setUsers(prev => prev.map(x => x._id===u._id? { ...x, featureFlags: { ...(x.featureFlags||{}), [key]: old } } : x)); alert(e.message); }
  };

  const approveUser = async (u) => {
    await ApiService.patch(`/admin/users/${u._id}/approve`);
    setUsers(prev => prev.map(x => x._id===u._id? { ...x, status: 'active' } : x));
  };

  const deleteUser = async (u) => {
    if (isSelf(u)) return alert('You cannot delete your own account.');
    if (isAdminAccount(u)) return alert('Admin accounts cannot be deleted.');
    if (!confirm(`Delete user ${u.email}?`)) return;
    await ApiService.delete(`/admin/users/${u._id}`);
    setUsers(prev => prev.filter(x => x._id !== u._id));
  };

  const createUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      // Create via signup
      const r = await ApiService.post('/auth/signup', { name: form.name, email: form.email, password: form.password });
      const newId = r?.data?.user?.id;
      // Immediately set active
      if (newId) {
        await ApiService.patch(`/admin/users/${newId}/status`, { status: 'active' });
      }
      setForm({ name:'', email:'', password:'' });
      await loadUsers();
    } catch (e2) {
      alert(e2.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Admin • Users</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded border" onClick={loadUsers}>Refresh</button>
        </div>
      </div>

      {/* Create user */}
      <form onSubmit={createUser} className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-2 items-end border p-3 rounded">
        <div>
          <label className="block text-xs text-gray-600">Name</label>
          <input className="w-full border rounded px-2 py-1" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Full name" />
        </div>
        <div>
          <label className="block text-xs text-gray-600">Email</label>
          <input type="email" className="w-full border rounded px-2 py-1" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="user@example.com" required />
        </div>
        <div>
          <label className="block text-xs text-gray-600">Temp Password</label>
          <input type="password" className="w-full border rounded px-2 py-1" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="min 6 chars" required />
        </div>
        <div>
          <button disabled={creating} className="px-3 py-2 bg-blue-600 text-white rounded w-full md:w-auto">{creating? 'Creating...' : 'Create & Activate'}</button>
        </div>
      </form>

      {loading? <div>Loading...</div> : error? <div className="text-red-600">{error}</div> : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Status</th>
                <th className="p-2">Features</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u=> (
                <tr key={u._id} className="border-t">
                  <td className="p-2 text-left">
                    <div className="font-medium">{u.email}</div>
                    <div className="text-xs text-gray-500">{u.name || '—'}</div>
                  </td>
                  <td className="p-2 text-center">
                    <select
                      className="border rounded px-2 py-1"
                      value={u.role}
                      disabled={isSelf(u)}
                      onChange={e=>onChangeRole(u, e.target.value)}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="p-2 text-center">
                    <select
                      className="border rounded px-2 py-1"
                      value={u.status}
                      disabled={isAdminAccount(u)}
                      onChange={e=>onChangeStatus(u, e.target.value)}
                    >
                      <option value="pending">pending</option>
                      <option value="active">active</option>
                      <option value="disabled">disabled</option>
                    </select>
                  </td>
                  <td className="p-2 text-center">
                    <div className="flex flex-col gap-1 items-start md:items-center md:flex-row md:justify-center">
                      {[
                        ['enableCodeEditor','Code Editor'],
                        ['enableTechnicalSections','Technical'],
                        ['enableImages','Images'],
                        ['enableExportAdvanced','Advanced Export']
                      ].map(([key,label]) => (
                        <label key={key} className="inline-flex items-center gap-1 text-xs">
                          <input
                            type="checkbox"
                            checked={!!(u.featureFlags?.[key])}
                            onChange={e=>onToggleFeature(u, key, e.target.checked)}
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </td>
                  <td className="p-2 text-center space-x-2">
                    {u.status!=='active' && <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={()=>approveUser(u)}>Approve</button>}
                    <button className="px-2 py-1 bg-red-600 text-white rounded" disabled={isSelf(u) || isAdminAccount(u)} onClick={()=>deleteUser(u)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
