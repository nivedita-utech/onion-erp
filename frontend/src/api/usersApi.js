import { apiSlice } from './apiSlice';

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (params) => ({
        url: '/users',
        params,
      }),
      providesTags: ['Users'],
    }),
    getUser: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Users', id }],
    }),
    createUser: builder.mutation({
      query: (data) => ({
        url: '/users',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Users'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Users'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
    changeRole: builder.mutation({
      query: ({ id, roleId }) => ({
        url: `/users/${id}/role`,
        method: 'PUT',
        body: { roleId },
      }),
      invalidatesTags: ['Users'],
    }),
    resetPassword: builder.mutation({
      query: ({ id, password }) => ({
        url: `/users/${id}/reset-password`,
        method: 'PUT',
        body: { password },
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useChangeRoleMutation,
  useResetPasswordMutation,
} = usersApi;
