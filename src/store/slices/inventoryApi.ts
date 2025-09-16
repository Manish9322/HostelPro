import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { InventoryItem } from '@/lib/types';

export const inventoryApi = createApi({
  reducerPath: 'inventoryApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Inventory'],
  endpoints: (builder) => ({
    getInventory: builder.query<InventoryItem[], void>({
      query: () => 'inventory',
      providesTags: ['Inventory'],
    }),
    addInventoryItem: builder.mutation<InventoryItem, Partial<InventoryItem>>({
      query: (body) => ({
        url: 'inventory',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Inventory'],
    }),
    updateInventoryItem: builder.mutation<InventoryItem, { id: string; body: Partial<InventoryItem> }>({
      query: ({ id, body }) => ({
        url: `inventory?id=${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Inventory'],
    }),
    deleteInventoryItem: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `inventory?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Inventory'],
    }),
  }),
});

export const {
  useGetInventoryQuery,
  useAddInventoryItemMutation,
  useUpdateInventoryItemMutation,
  useDeleteInventoryItemMutation,
} = inventoryApi;
