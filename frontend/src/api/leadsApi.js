import { apiSlice } from './apiSlice';

export const leadsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLeads: builder.query({
      query: (params) => ({ url: '/leads', params }),
      providesTags: ['Leads'],
    }),
    getLead: builder.query({
      query: (id) => `/leads/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Leads', id }],
    }),
    createLead: builder.mutation({
      query: (data) => ({ url: '/leads', method: 'POST', body: data }),
      invalidatesTags: ['Leads'],
    }),
    updateLead: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/leads/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Leads'],
    }),
    deleteLead: builder.mutation({
      query: (id) => ({ url: `/leads/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Leads'],
    }),
    updateLeadStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `/leads/${id}/status`, method: 'PUT', body: { status } }),
      invalidatesTags: ['Leads'],
    }),
    addFollowUp: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/leads/${id}/followup`, method: 'POST', body: data }),
      invalidatesTags: ['Leads'],
    }),
    convertLead: builder.mutation({
      query: (id) => ({ url: `/leads/${id}/convert`, method: 'POST' }),
      invalidatesTags: ['Leads', 'Customers'],
    }),
  }),
});

export const {
  useGetLeadsQuery, useGetLeadQuery, useCreateLeadMutation,
  useUpdateLeadMutation, useDeleteLeadMutation, useUpdateLeadStatusMutation,
  useAddFollowUpMutation, useConvertLeadMutation,
} = leadsApi;
