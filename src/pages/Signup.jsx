import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupAsync } from '../store/slices/authSlice.js';
import { Link, Navigate } from 'react-router-dom';

const Signup = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(s=>s.auth);
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [done,setDone]=useState(false);
  if (user) return <Navigate to="/" replace />;
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Create account</h2>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        {done ? (
          <div>
            <p className="mb-4">Signup successful. Wait for admin approval, then you can login.</p>
            <Link to="/login" className="text-blue-600">Go to login</Link>
          </div>
        ) : (
        <div className="space-y-3">
          <input className="w-full border p-2 rounded" placeholder="Name (optional)" value={name} onChange={e=>setName(e.target.value)} />
          <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button disabled={loading} onClick={async()=>{ const res = await dispatch(signupAsync({name,email,password})); if (res.meta.requestStatus==='fulfilled') setDone(true); }} className="w-full bg-blue-600 text-white rounded p-2">{loading? 'Submitting...' : 'Sign up'}</button>
          <Link to="/login" className="text-sm text-blue-600">Back to login</Link>
        </div>)}
      </div>
    </div>
  );
};

export default Signup;
