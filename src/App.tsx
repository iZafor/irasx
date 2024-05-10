import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./login";
import { getStoredAuthData, validateStoredAuthData } from "./lib/utils";
import { redirect } from "react-router-dom";
import Dashboard from "./dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    loader: async () => {
      const authData = getStoredAuthData();
      if (validateStoredAuthData(authData)) {
        return redirect("/dashboard");
      }
      return null;
    }
  },
  {
    path: "/dashboard/*",
    element: <Dashboard />,
    loader: async () => {
      const authData = getStoredAuthData();
      if (!validateStoredAuthData(authData)) {
        return redirect("/");
      }
      return authData;
    }
  },
]);

export default function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
