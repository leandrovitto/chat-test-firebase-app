import { Loader } from "@/components/molecules/Loader";
import { useAuth } from "@/provider/AuthProvider";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

type Props = {};

const PrivateLayout = (_props: Props) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
    }
  }, [user, navigate, loading]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="">
      <Outlet />
    </div>
  );
};

export default PrivateLayout;
