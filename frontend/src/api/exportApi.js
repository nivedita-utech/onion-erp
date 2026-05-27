import { apiSlice } from './apiSlice';

export const exportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExportOrders: builder.query({
      query: (params) => ({ url: '/export', params }),
      providesTags: ['Export'],
    }),
    getExportOrder: builder.query({
      query: (id) => `/export/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Export', id }],
    }),
    createExportOrder: builder.mutation({
      query: (data) => ({ url: '/export', method: 'POST', body: data }),
      invalidatesTags: ['Export'],
    }),
    updateExportOrder: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/export/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Export'],
    }),
    attachDocuments: builder.mutation({
      query: ({ id, formData }) => ({ url: `/export/${id}/documents`, method: 'POST', body: formData }),
      invalidatesTags: ['Export'],
    }),
    getTracking: builder.query({
      query: (id) => `/export/${id}/tracking`,
      providesTags: ['Export'],
    }),
  }),
});

export const {
  useGetExportOrdersQuery, useGetExportOrderQuery, useCreateExportOrderMutation,
  useUpdateExportOrderMutation, useAttachDocumentsMutation, useGetTrackingQuery,
} = exportApi;
