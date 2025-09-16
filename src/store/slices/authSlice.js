import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from '../../services/authService.js';

export const loginAsync = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try { return await AuthService.login(payload); } catch (e) { return rejectWithValue(e.message); }
});
export const signupAsync = createAsyncThunk('auth/signup', async (payload, { rejectWithValue }) => {
  try { return await AuthService.signup(payload); } catch (e) { return rejectWithValue(e.message); }
});
export const meAsync = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try { return await AuthService.me(); } catch (e) { return rejectWithValue(e.message); }
});

const initialUser = (() => { try { return JSON.parse(localStorage.getItem('ia_user')||'null'); } catch { return null; } })();
const initialState = { user: initialUser, token: localStorage.getItem('ia_token') || null, loading: false, error: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) { state.user=null; state.token=null; AuthService.logout(); },
  },
  extraReducers: (b) => {
    b.addCase(loginAsync.pending, (s)=>{s.loading=true;s.error=null;})
     .addCase(loginAsync.fulfilled, (s,a)=>{s.loading=false;s.token=a.payload.token;s.user=a.payload.user||s.user;})
     .addCase(loginAsync.rejected, (s,a)=>{s.loading=false;s.error=a.payload;})
     .addCase(signupAsync.pending, (s)=>{s.loading=true;s.error=null;})
     .addCase(signupAsync.fulfilled, (s)=>{s.loading=false;})
     .addCase(signupAsync.rejected, (s,a)=>{s.loading=false;s.error=a.payload;})
     .addCase(meAsync.fulfilled, (s,a)=>{s.user=a.payload||s.user;});
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
