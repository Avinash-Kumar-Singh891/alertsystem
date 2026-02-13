import { createBrowserRouter } from "react-router";
import { AlertOverview } from "./components/AlertOverview";
import { AlertDetail } from "./components/AlertDetail";
import { AlertResolution } from "./components/AlertResolution";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AlertOverview,
  },
  {
    path: "/alert/:id",
    Component: AlertDetail,
  },
  {
    path: "/alert/:id/resolve",
    Component: AlertResolution,
  },
]);
