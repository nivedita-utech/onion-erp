import { apiSlice } from './apiSlice';

export const employeesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: (params) => ({ url: '/employees', params }),
      providesTags: ['Employees'],
    }),
    getEmployee: builder.query({
      query: (id) => `/employees/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Employees', id }],
    }),
    createEmployee: builder.mutation({
      query: (data) => ({ url: '/employees', method: 'POST', body: data }),
      invalidatesTags: ['Employees'],
    }),
    updateEmployee: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/employees/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Employees'],
    }),
    deleteEmployee: builder.mutation({
      query: (id) => ({ url: `/employees/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Employees'],
    }),
    markAttendance: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/employees/${id}/attendance`, method: 'POST', body: data }),
      invalidatesTags: ['Employees'],
    }),
    getSalaryHistory: builder.query({
      query: (id) => `/employees/${id}/salary`,
      providesTags: ['Employees'],
    }),
  }),
});

export const {
  useGetEmployeesQuery, useGetEmployeeQuery, useCreateEmployeeMutation,
  useUpdateEmployeeMutation, useDeleteEmployeeMutation,
  useMarkAttendanceMutation, useGetSalaryHistoryQuery,
} = employeesApi;
