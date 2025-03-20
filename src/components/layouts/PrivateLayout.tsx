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
    <div className="border-4 border-red-500 p-8 m-8">
      PrivateLayout
      <Outlet />
    </div>
  );
};

export default PrivateLayout;
