import { Outlet } from "react-router";
import { Button } from "../ui/button";

type Props = {};

const DefaultLayout = (_props: Props) => {
  return (
    <div className="border-4 border-blue-500 p-8 m-8">
      DefaultLayout
      <Button>Button</Button>
      <Outlet />
    </div>
  );
};

export default DefaultLayout;
