import { apiSlice } from './apiSlice';

export const customersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: (params) => ({ url: '/customers', params }),
      providesTags: ['Customers'],
    }),
    getCustomer: builder.query({
      query: (id) => `/customers/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Customers', id }],
    }),
    createCustomer: builder.mutation({
      query: (data) => ({ url: '/customers', method: 'POST', body: data }),
      invalidatesTags: ['Customers'],
    }),
    updateCustomer: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/customers/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Customers'],
    }),
    deleteCustomer: builder.mutation({
      query: (id) => ({ url: `/customers/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Customers'],
    }),
    getCustomerOrders: builder.query({
      query: (id) => `/customers/${id}/orders`,
      providesTags: ['Customers', 'Sales'],
    }),
    getCustomerPayments: builder.query({
      query: (id) => `/customers/${id}/payments`,
      providesTags: ['Customers', 'Accounts'],
    }),
  }),
});

export const {
  useGetCustomersQuery, useGetCustomerQuery, useCreateCustomerMutation,
  useUpdateCustomerMutation, useDeleteCustomerMutation,
  useGetCustomerOrdersQuery, useGetCustomerPaymentsQuery,
} = customersApi;
