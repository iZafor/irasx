import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./login";
import { validateStoredAuthData } from "./lib/utils";
import { redirect } from "react-router-dom";
import Dashboard from "./dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    loader: async () => {
      if (validateStoredAuthData()) {
        return redirect("/dashboard");
      }
      return null;
    }
  },
  {
    path: "/dashboard/*",
    element: <Dashboard />,
    loader: async () => {
      if (!validateStoredAuthData()) {
        return redirect("/");
      }
      return null;
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
