import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '@/services/api';

interface User {
  id: string;
  username: string;
  mobile: string;
  emailId: string;
  status: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Update the LoginResponse interface
interface LoginResponse {
  success: boolean;
  error: boolean;
  message: string;
  code: number;
  data: {
    user_id: string;
    username: string;
    mobile: string;
    emailId: string;
    status: string;
  };
}



const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunk for login
export const loginUser = createAsyncThunk<
  User,
  { username: string; password: string },
  { rejectValue: string }
>(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(username, password);
      const loginResponse = response.data as LoginResponse;

      // Check if success is true and data exists
      if (loginResponse.success && loginResponse.data) {
        console.log('Login successful:', loginResponse);
        
        // Map the API response to our User interface
        const user: User = {
          id: loginResponse.data.user_id,
          username: loginResponse.data.username,
          mobile: loginResponse.data.mobile,
          emailId: loginResponse.data.emailId,
          status: loginResponse.data.status
        };
        return user;
      } else {
        return rejectWithValue(loginResponse.message || 'Login failed');
      }
    } catch (error: any) {
      // Handle different types of errors
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue('Request timeout. Please check your connection and try again.');
      }

      if (error.code === 'NETWORK_ERROR' || !error.response) {
        return rejectWithValue('Network error. Please check your internet connection.');
      }

      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }

      return rejectWithValue('Login failed. Please try again.');
    }
  }
);



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;