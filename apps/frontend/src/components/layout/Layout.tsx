// components/Layout.tsx
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
