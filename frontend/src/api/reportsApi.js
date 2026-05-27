import { apiSlice } from './apiSlice';

export const reportsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSalesReport: builder.query({
      query: (params) => ({ url: '/reports/sales-report', params }),
      providesTags: ['Reports'],
    }),
    getPurchaseReport: builder.query({
      query: (params) => ({ url: '/reports/purchase-report', params }),
      providesTags: ['Reports'],
    }),
    getInventoryReport: builder.query({
      query: (params) => ({ url: '/reports/inventory-report', params }),
      providesTags: ['Reports'],
    }),
    getExportPerformance: builder.query({
      query: (params) => ({ url: '/reports/export-performance', params }),
      providesTags: ['Reports'],
    }),
    getProfitLoss: builder.query({
      query: (params) => ({ url: '/reports/profit-loss', params }),
      providesTags: ['Reports'],
    }),
  }),
});

export const {
  useGetSalesReportQuery, useGetPurchaseReportQuery,
  useGetInventoryReportQuery, useGetExportPerformanceQuery,
  useGetProfitLossQuery,
} = reportsApi;
