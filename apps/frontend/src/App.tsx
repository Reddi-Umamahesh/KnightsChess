import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/Home/LandingPage";
import { useRecoilState } from "recoil";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { USER_TOKEN } from "./utils/constants";
import { tokenState } from "./recoil/userAtoms";
import { useEffect } from "react";
import Login from "./features/auth/Login_Signup";
import HomePage from "./pages/Home/HomePage";
import { Game } from "./pages/Game/Game";
import NotFoundPage from "./pages/Home/NotFoundPage";

function App() {
  const [token, setToken] = useRecoilState(tokenState);
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === USER_TOKEN) {
        setToken(e.newValue);
        if (token) {      
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [setToken]);

  const appRouter = createBrowserRouter(
    [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/home",
        element: <HomePage/>,
      },
      {
        path: "/game/:id",
        element: <Game />,
      },
      {
        path: "*",
        element: <NotFoundPage />
      }
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
    <>
      <div className="min-h-screen w-full bg-black text-white font-sans">
        <RouterProvider router={appRouter} />
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
