import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GalleryImage } from '@/lib/types';

export const galleryApi = createApi({
  reducerPath: 'galleryApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Gallery'],
  endpoints: (builder) => ({
    getGalleryImages: builder.query<GalleryImage[], void>({
      query: () => 'gallery',
      providesTags: ['Gallery'],
    }),
    addGalleryImage: builder.mutation<GalleryImage, FormData>({
        query: (body) => ({
            url: 'gallery',
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Gallery'],
    }),
    deleteGalleryImage: builder.mutation<{success: boolean, id: string}, string>({
        query: (id) => ({
            url: `gallery?id=${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Gallery'],
    })
  }),
});

export const { useGetGalleryImagesQuery, useAddGalleryImageMutation, useDeleteGalleryImageMutation } = galleryApi;
