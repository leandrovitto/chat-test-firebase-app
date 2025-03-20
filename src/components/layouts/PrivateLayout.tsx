import { AuthContext, AuthContextType } from "@/provider/AuthProvider";
import { Loader } from "lucide-react";
import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

type Props = {};

const PrivateLayout = (_props: Props) => {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext) as AuthContextType;

  useEffect(() => {
    if (!user) {
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
