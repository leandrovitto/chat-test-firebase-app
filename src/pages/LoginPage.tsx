import { LoginForm } from "@/components/molecules/auth/LoginForm";
import { Loader } from "@/components/molecules/Loader";
import { AuthContext, AuthContextType } from "@/provider/AuthProvider";

import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";

type Props = {};

const LoginPage = (_props: Props) => {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext) as AuthContextType;

  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
