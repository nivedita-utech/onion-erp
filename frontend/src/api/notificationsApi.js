import { apiSlice } from './apiSlice';

export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (params) => ({ url: '/notifications', params }),
      providesTags: ['Notifications'],
    }),
    markAsRead: builder.mutation({
      query: (id) => ({ url: `/notifications/${id}/read`, method: 'PUT' }),
      invalidatesTags: ['Notifications'],
    }),
    markAllAsRead: builder.mutation({
      query: () => ({ url: '/notifications/read-all', method: 'PUT' }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetNotificationsQuery, useMarkAsReadMutation, useMarkAllAsReadMutation,
} = notificationsApi;
