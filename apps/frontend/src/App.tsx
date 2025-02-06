import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./home/LandingPage";
import Game from "./screens/Game";
import { RecoilRoot, useRecoilState } from "recoil";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./auth/UserContext";
import LoginForm from "./auth/Login";
import RegisterForm from "./auth/RegisterForm";
// import { getJWTTOKENFromLocalStorage } from "./lib/utils";
// import { WebSocketProvider } from "./hooks/useSocket";
import { USER_TOKEN } from "./utils/constants";
import Layout from "./components/Layout";
import { tokenState } from "./recoil/userAtoms";
import { useEffect } from "react";

function App() {

  const [token, setToken] = useRecoilState(tokenState);
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === USER_TOKEN) {
        setToken(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage" , handleStorageChange)
  } , [setToken])

  const appRouter = createBrowserRouter(
    [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/login",
        element: <LoginForm />,
      },
      {
        path: "/signup",
        element: <RegisterForm />,
      },
      {
        element: <Layout />,
        children: [
          {
            path: "/game",
            element: <Game />,
          },
        ],
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
   
      <UserProvider>
        <div className=" w-full bg-[#312E2b]">
          <RouterProvider router={appRouter} />
        </div>
        <ToastContainer />
      </UserProvider>
    
  );
}

export default App;
