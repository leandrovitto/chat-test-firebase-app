import { LoginForm } from "@/components/molecules/auth/LoginForm";
import { Loader } from "@/components/molecules/Loader";
import { useAuth } from "@/provider/AuthProvider";

import { useEffect } from "react";
import { useNavigate } from "react-router";

type Props = {};

const LoginPage = (_props: Props) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      navigate("/chat");
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
