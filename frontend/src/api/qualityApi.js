import { apiSlice } from './apiSlice';

export const qualityApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQualityProfiles: builder.query({
      query: () => '/quality/profiles',
      providesTags: ['QualityProfile'],
    }),
    createQualityProfile: builder.mutation({
      query: (data) => ({
        url: '/quality/profiles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['QualityProfile'],
    }),
    getLabTests: builder.query({
      query: () => '/quality/tests',
      providesTags: ['LabTest'],
    }),
    createLabTest: builder.mutation({
      query: (data) => ({
        url: '/quality/tests',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['LabTest', 'Production'],
    }),
    downloadCOA: builder.query({
      query: (id) => ({
        url: `/quality/tests/${id}/coa`,
        responseHandler: async (response) => {
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to generate PDF');
          }
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const result = await response.json();
            if (!result.success) throw new Error(result.message);
            return result;
          }
          return response.blob();
        },
      }),
    }),
  }),
});

export const {
  useGetQualityProfilesQuery,
  useCreateQualityProfileMutation,
  useGetLabTestsQuery,
  useCreateLabTestMutation,
  useLazyDownloadCOAQuery,
} = qualityApi;
