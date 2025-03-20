import { useContext } from "react";
import { AuthContext, AuthContextType } from "@/provider/AuthProvider";
import { Button } from "@/components/ui/button";

const LoginWithGoogle = () => {
  const { handleLoginWithGoogle } = useContext(AuthContext) as AuthContextType;

  return (
    <div>
      <Button onClick={handleLoginWithGoogle}>Login with Google</Button>
    </div>
  );
};

export default LoginWithGoogle;
