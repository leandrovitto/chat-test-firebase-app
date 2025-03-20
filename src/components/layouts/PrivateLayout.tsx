import { AuthContext, AuthContextType } from "@/provider/AuthProvider";
import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { Loader } from "@/components/molecules/Loader";

type Props = {};

const PrivateLayout = (_props: Props) => {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext) as AuthContextType;

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
    }
  }, [user, navigate]);

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
