import { Button } from "@/components/ui/button";
import { useAuth } from "@/provider/AuthProvider";

const LoginWithGoogle = () => {
  const { handleLoginWithGoogle } = useAuth();

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
