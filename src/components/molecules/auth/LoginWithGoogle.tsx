import { useContext } from "react";
import { AuthContext, AuthContextType } from "@/provider/AuthProvider";
import { Button } from "@/components/ui/button";

const LoginWithGoogle = () => {
  const { handleLoginWithGoogle } = useContext(AuthContext) as AuthContextType;

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleLoginWithGoogle}
    >
      Login with Google
    </Button>
  );
};

export default LoginWithGoogle;
