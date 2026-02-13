import React from 'react';
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AlertOverview } from './pages/AlertOverview';
import { AlertDetail } from './pages/AlertDetail';
import { AlertResolution } from './pages/AlertResolution';
import { Toaster } from 'sonner';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<AlertOverview />} />
      <Route path="alerts/:id" element={<AlertDetail />} />
      <Route path="alerts/:id/resolve" element={<AlertResolution />} />
      <Route path="dashboard" element={<div className="p-8 text-center text-gray-500">Dashboard functionality coming soon</div>} />
      <Route path="settings" element={<div className="p-8 text-center text-gray-500">Settings functionality coming soon</div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  )
);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}
