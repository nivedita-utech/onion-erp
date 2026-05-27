import { apiSlice } from './apiSlice';

export const purchaseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPurchaseOrders: builder.query({
      query: (params) => ({ url: '/purchase/purchase-orders', params }),
      providesTags: ['Purchase'],
    }),
    getPurchaseOrder: builder.query({
      query: (id) => `/purchase/purchase-orders/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Purchase', id }],
    }),
    createPurchaseOrder: builder.mutation({
      query: (data) => ({ url: '/purchase/purchase-orders', method: 'POST', body: data }),
      invalidatesTags: ['Purchase'],
    }),
    updatePurchaseOrder: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/purchase/purchase-orders/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Purchase'],
    }),
    createGRN: builder.mutation({
      query: (data) => ({ url: '/purchase/grn', method: 'POST', body: data }),
      invalidatesTags: ['Purchase', 'Inventory'],
    }),
    getSuppliers: builder.query({
      query: (params) => ({ url: '/purchase/suppliers', params }),
      providesTags: ['Purchase'],
    }),
    createSupplier: builder.mutation({
      query: (data) => ({ url: '/purchase/suppliers', method: 'POST', body: data }),
      invalidatesTags: ['Purchase'],
    }),
    updateSupplier: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/purchase/suppliers/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Purchase'],
    }),
  }),
});

export const {
  useGetPurchaseOrdersQuery, useGetPurchaseOrderQuery,
  useCreatePurchaseOrderMutation, useUpdatePurchaseOrderMutation,
  useCreateGRNMutation, useGetSuppliersQuery, useCreateSupplierMutation,
  useUpdateSupplierMutation,
} = purchaseApi;
