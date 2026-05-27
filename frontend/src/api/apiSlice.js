import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import toast from 'react-hot-toast';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error) {
    if (result.error.status === 401) {
      api.dispatch({ type: 'auth/logout' });
      toast.error('Session expired. Please log in again.');
      window.location.href = '/auth/login';
    } else {
      const errorMessage = result.error.data?.message || 'An error occurred';
      if (args.method && args.method !== 'GET') {
         toast.error(errorMessage);
      }
    }
  } else if (result?.data && args.method && args.method !== 'GET') {
    // Show success toasts for mutations
    const successMessage = result.data.message || 'Operation successful';
    toast.success(successMessage);
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Auth',
    'Users',
    'Roles',
    'Employees',
    'Leads',
    'Customers',
    'Products',
    'Inventory',
    'Production',
    'Purchase',
    'Sales',
    'Export',
    'Accounts',
    'Reports',
    'Notifications',
    'Documents',
  ],
  endpoints: () => ({}),
});
