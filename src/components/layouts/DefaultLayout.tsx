import Navbar from "@/components/molecules/Navbar";
import { Outlet } from "react-router";

type Props = {};

const DefaultLayout = (_props: Props) => {
  return (
    <div className="w-full">
      <Navbar />
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default DefaultLayout;
