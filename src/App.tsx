import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { ModeToggle } from "./components/mode-toggle"
import Login from "./login";
import { validateStoredAuthData } from "./lib/utils";
import { redirect } from "react-router-dom";

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
]);

export default function App() {
  return (
    <div>
      <div className="w-full grid justify-end pr-4 mt-4">
        <ModeToggle />
      </div>
      <RouterProvider router={router} />
    </div>
  );
}
