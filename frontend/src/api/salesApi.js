import { apiSlice } from './apiSlice';

export const salesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSalesOrders: builder.query({
      query: (params) => ({ url: '/sales/orders', params }),
      providesTags: ['Sales'],
    }),
    getSalesOrder: builder.query({
      query: (id) => `/sales/orders/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Sales', id }],
    }),
    createSalesOrder: builder.mutation({
      query: (data) => ({ url: '/sales/orders', method: 'POST', body: data }),
      invalidatesTags: ['Sales'],
    }),
    updateSalesOrder: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/sales/orders/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Sales'],
    }),
    createQuotation: builder.mutation({
      query: (data) => ({ url: '/sales/quotations', method: 'POST', body: data }),
      invalidatesTags: ['Sales'],
    }),
    generateInvoice: builder.query({
      query: (id) => `/sales/invoices/${id}`,
    }),
    dispatchOrder: builder.mutation({
      query: (id) => ({ url: `/sales/orders/${id}/dispatch`, method: 'POST' }),
      invalidatesTags: ['Sales', 'Inventory'],
    }),
  }),
});

export const {
  useGetSalesOrdersQuery, useGetSalesOrderQuery, useCreateSalesOrderMutation,
  useUpdateSalesOrderMutation, useCreateQuotationMutation, useGenerateInvoiceQuery,
  useDispatchOrderMutation,
} = salesApi;
