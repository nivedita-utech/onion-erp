import { apiSlice } from './apiSlice';

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({ url: '/products', params }),
      providesTags: ['Products'],
    }),
    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Products', id }],
    }),
    createProduct: builder.mutation({
      query: (data) => ({ url: '/products', method: 'POST', body: data }),
      invalidatesTags: ['Products'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/products/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Products'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Products'],
    }),
  }),
});

export const {
  useGetProductsQuery, useGetProductQuery, useCreateProductMutation,
  useUpdateProductMutation, useDeleteProductMutation,
} = productsApi;
