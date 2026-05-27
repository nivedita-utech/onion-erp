import { apiSlice } from './apiSlice';

export const productionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBatches: builder.query({
      query: (params) => ({ url: '/production', params }),
      providesTags: ['Production'],
    }),
    getBatch: builder.query({
      query: (id) => `/production/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Production', id }],
    }),
    createBatch: builder.mutation({
      query: (data) => ({ url: '/production', method: 'POST', body: data }),
      invalidatesTags: ['Production'],
    }),
    updateBatch: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/production/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Production'],
    }),
    updateStage: builder.mutation({
      query: ({ id, stage }) => ({ url: `/production/${id}/stage`, method: 'PUT', body: { stage } }),
      invalidatesTags: ['Production', 'Inventory'],
    }),
    getProductionSummary: builder.query({
      query: () => '/production/summary',
      providesTags: ['Production'],
    }),
    startProduction: builder.mutation({
      query: (id) => ({ url: `/production/${id}/start`, method: 'POST' }),
      invalidatesTags: ['Production', 'Inventory'],
    }),
    completeProduction: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/production/${id}/complete`, method: 'POST', body: data }),
      invalidatesTags: ['Production', 'Inventory'],
    }),
  }),
});

export const {
  useGetBatchesQuery, useGetBatchQuery, useCreateBatchMutation,
  useUpdateBatchMutation, useUpdateStageMutation, useGetProductionSummaryQuery,
  useStartProductionMutation, useCompleteProductionMutation,
} = productionApi;
