import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { applicationsApi } from './slices/applicationsApi';
import { studentsApi } from './slices/studentsApi';
import { roomsApi } from './slices/roomsApi';
import { feesApi } from './slices/feesApi';
import { inventoryApi } from './slices/inventoryApi';
import { complaintsApi } from './slices/complaintsApi';
import { noticesApi } from './slices/noticesApi';
import { boardMembersApi } from './slices/boardMembersApi';
import { settingsApi } from './slices/settingsApi';
import { faqsApi } from './slices/faqsApi';
import { galleryApi } from './slices/galleryApi';
import { feedbackApi } from './slices/feedbackApi';
import { utilitiesApi } from './slices/utilitiesApi';
import { inquiriesApi } from './slices/inquiriesApi';

export const store = configureStore({
  reducer: {
    [applicationsApi.reducerPath]: applicationsApi.reducer,
    [studentsApi.reducerPath]: studentsApi.reducer,
    [roomsApi.reducerPath]: roomsApi.reducer,
    [feesApi.reducerPath]: feesApi.reducer,
    [inventoryApi.reducerPath]: inventoryApi.reducer,
    [complaintsApi.reducerPath]: complaintsApi.reducer,
    [noticesApi.reducerPath]: noticesApi.reducer,
    [boardMembersApi.reducerPath]: boardMembersApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [faqsApi.reducerPath]: faqsApi.reducer,
    [galleryApi.reducerPath]: galleryApi.reducer,
    [feedbackApi.reducerPath]: feedbackApi.reducer,
    [utilitiesApi.reducerPath]: utilitiesApi.reducer,
    [inquiriesApi.reducerPath]: inquiriesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(applicationsApi.middleware)
      .concat(studentsApi.middleware)
      .concat(roomsApi.middleware)
      .concat(feesApi.middleware)
      .concat(inventoryApi.middleware)
      .concat(complaintsApi.middleware)
      .concat(noticesApi.middleware)
      .concat(boardMembersApi.middleware)
      .concat(settingsApi.middleware)
      .concat(faqsApi.middleware)
      .concat(galleryApi.middleware)
      .concat(feedbackApi.middleware)
      .concat(utilitiesApi.middleware)
      .concat(inquiriesApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
