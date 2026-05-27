import { apiSlice } from './apiSlice';

export const accountsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReceivables: builder.query({
      query: (params) => ({ url: '/accounts/receivables', params }),
      providesTags: ['Accounts'],
    }),
    getPayables: builder.query({
      query: (params) => ({ url: '/accounts/payables', params }),
      providesTags: ['Accounts'],
    }),
    recordPayment: builder.mutation({
      query: (data) => ({ url: '/accounts/payment', method: 'POST', body: data }),
      invalidatesTags: ['Accounts', 'Sales', 'Purchase'],
    }),
    getAccountsSummary: builder.query({
      query: (params) => ({ url: '/accounts/summary', params }),
      providesTags: ['Accounts'],
    }),
    getPaymentReminders: builder.query({
      query: () => '/accounts/payment-reminders',
      providesTags: ['Accounts'],
    }),
  }),
});

export const {
  useGetReceivablesQuery, useGetPayablesQuery, useRecordPaymentMutation,
  useGetAccountsSummaryQuery, useGetPaymentRemindersQuery,
} = accountsApi;
