import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/provider/AuthProvider";
import { useNavigate } from "react-router";

export const UserMenu = () => {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="mx-4">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="relative flex rounded-full bg-white text-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden">
            <span className="absolute -inset-1.5" />
            <span className="sr-only">Open user menu</span>
            <img src={user?.photoURL || ""} className="size-8 rounded-full" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            <p className="block px-1 py-1 text-xs text-gray-500 data-focus:bg-gray-100 data-focus:outline-hidden">
              {user.email}
            </p>
            <p className="block px-1 py-1 text-xs text-gray-200 data-focus:bg-gray-100 data-focus:outline-hidden">
              {user.uid}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/dashboard")}>
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/chat")}>
            Chat
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
