import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Room } from '@/lib/types';

export const roomsApi = createApi({
  reducerPath: 'roomsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Rooms'],
  endpoints: (builder) => ({
    getRooms: builder.query<Room[], void>({
      query: () => 'rooms',
      providesTags: ['Rooms'],
    }),
    addRoom: builder.mutation<Room, Partial<Room>>({
      query: (body) => ({
        url: 'rooms',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Rooms'],
    }),
    updateRoom: builder.mutation<Room, { id: string; body: Partial<Room> }>({
      query: ({ id, body }) => ({
        url: `rooms?id=${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Rooms', 'Students'],
    }),
    deleteRoom: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `rooms?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Rooms'],
    }),
    allocateRooms: builder.mutation<{allocatedCount: number, waitingListCount: number}, {priority: string, matchGender: boolean, matchPreferences: boolean}>({
        query: (body) => ({
            url: 'rooms/allocate',
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Rooms', 'Students'],
    })
  }),
});

export const {
  useGetRoomsQuery,
  useAddRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useAllocateRoomsMutation,
} = roomsApi;
