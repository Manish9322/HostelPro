import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Notice } from '@/lib/types';

export const noticesApi = createApi({
  reducerPath: 'noticesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Notices'],
  endpoints: (builder) => ({
    getNotices: builder.query<Notice[], void>({
      query: () => 'notices',
      providesTags: ['Notices'],
    }),
    addNotice: builder.mutation<Notice, Omit<Notice, '_id' | 'id' | 'publishedAt'>>({
        query: (body) => ({
            url: 'notices',
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Notices'],
    }),
    updateNotice: builder.mutation<Notice, {id: string, body: Partial<Notice>}>({
        query: ({id, body}) => ({
            url: `notices?id=${id}`,
            method: 'PUT',
            body,
        }),
        invalidatesTags: ['Notices'],
    }),
    deleteNotice: builder.mutation<{success: boolean, id: string}, string>({
        query: (id) => ({
            url: `notices?id=${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Notices'],
    }),
    reorderNotices: builder.mutation<void, { orderedIds: string[] }>({
        query: (body) => ({
            url: 'notices/reorder',
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Notices'],
    })
  }),
});

export const { 
    useGetNoticesQuery,
    useAddNoticeMutation,
    useUpdateNoticeMutation,
    useDeleteNoticeMutation,
    useReorderNoticesMutation,
} = noticesApi;
