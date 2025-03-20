import { Outlet } from "react-router";

type Props = {};

const PrivateLayout = (_props: Props) => {
  return (
    <div className="border-4 border-red-500 p-8 m-8">
      PrivateLayout
      <Outlet />
    </div>
  );
};

export default PrivateLayout;
