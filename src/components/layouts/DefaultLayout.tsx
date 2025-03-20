import Navbar from "@/components/molecules/Navbar";
import { Outlet } from "react-router";

type Props = {};

const DefaultLayout = (_props: Props) => {
  return (
    <div className="border-4 border-blue-500 w-full">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default DefaultLayout;
