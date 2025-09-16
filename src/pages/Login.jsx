import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync } from '../store/slices/authSlice.js';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(s=>s.auth);
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  if (user) return <Navigate to="/" replace />;
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Sign in</h2>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <div className="space-y-3">
          <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button disabled={loading} onClick={()=>dispatch(loginAsync({email,password}))} className="w-full bg-blue-600 text-white rounded p-2">{loading? 'Signing in...' : 'Sign in'}</button>
          <a href="#/signup" onClick={(e)=>{e.preventDefault(); window.location.href='/signup';}} className="text-sm text-blue-600">Create an account</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
