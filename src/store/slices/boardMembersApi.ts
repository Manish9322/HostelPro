import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BoardMember } from '@/lib/types';

export const boardMembersApi = createApi({
  reducerPath: 'boardMembersApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['BoardMembers'],
  endpoints: (builder) => ({
    getBoardMembers: builder.query<BoardMember[], { visibleOnly?: boolean }>({
      query: ({ visibleOnly = false }) => `board-members?visible=${visibleOnly}`,
      providesTags: ['BoardMembers'],
    }),
    addBoardMember: builder.mutation<BoardMember, FormData>({
      query: (body) => ({
        url: 'board-members',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['BoardMembers'],
    }),
    updateBoardMember: builder.mutation<BoardMember, { id: string; body: FormData | Partial<BoardMember> }>({
      query: ({ id, body }) => ({
        url: `board-members?id=${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['BoardMembers'],
    }),
    deleteBoardMember: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `board-members?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BoardMembers'],
    }),
  }),
});

export const {
  useGetBoardMembersQuery,
  useAddBoardMemberMutation,
  useUpdateBoardMemberMutation,
  useDeleteBoardMemberMutation,
} = boardMembersApi;
