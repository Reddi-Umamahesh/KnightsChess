import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./components/home/LandingPage";
import Game from "./screens/Game";

function App() {

  const appRouter = createBrowserRouter(
    [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/game",
        element: <Game />,
      },
    ],
    {
      future: {
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_relativeSplatPath: true,
        v7_skipActionErrorRevalidation: true,
      },
    }
  );
  return (
    <div className=" w-full bg-[#312E2b]">
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
