import { apiSlice } from './apiSlice';

export const inventoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStock: builder.query({
      query: (params) => ({ url: '/inventory/stock', params }),
      providesTags: ['Inventory'],
    }),
    getBatch: builder.query({
      query: (id) => `/inventory/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Inventory', id }],
    }),
    adjustStock: builder.mutation({
      query: (data) => ({ url: '/inventory/adjust', method: 'POST', body: data }),
      invalidatesTags: ['Inventory'],
    }),
    getLowStock: builder.query({
      query: () => '/inventory/low-stock',
      providesTags: ['Inventory'],
    }),
    getWarehouseStock: builder.query({
      query: (id) => `/inventory/warehouse/${id}`,
      providesTags: ['Inventory'],
    }),
  }),
});

export const {
  useGetStockQuery, useGetBatchQuery, useAdjustStockMutation,
  useGetLowStockQuery, useGetWarehouseStockQuery,
} = inventoryApi;
