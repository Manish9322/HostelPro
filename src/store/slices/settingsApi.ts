import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface SettingsData {
    _id: string;
    roomConditions: string[];
    inventoryCategories: string[];
    inventoryConditions: string[];
    inventoryStatus: string[];
    complaintCategories: string[];
    noticeCategories: string[];
    boardMemberDesignations: string[];
    locationAddress: string;
    locationMapLink: string;
    [key: string]: any; 
}

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Settings'],
  endpoints: (builder) => ({
    getSettings: builder.query<SettingsData, void>({
      query: () => 'settings',
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation<SettingsData, Partial<SettingsData>>({
      query: (body) => ({
        url: 'settings',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;
