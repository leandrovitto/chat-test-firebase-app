import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
// import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/provider/AuthProvider";
import { useNavigate } from "react-router";
import { UserMenu } from "./auth/UserMenu";

const links = [
  { label: "Home", href: "/" },
  //{ label: "Dashboard (Private)", href: "/dashboard" },
  //{ label: "Chat (Private)", href: "/chat" },
];

const privateLinks = [
  //{ label: "Dashboard (Private)", href: "/dashboard" },
  { label: "Chat (Private)", href: "/chat" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="w-full flex justify-between items-center p-2 max-w-7xl mx-auto border-b border-gray-200">
      <div
        onClick={() => {
          navigate("/");
        }}
        className="flex items-center space-x-2 cursor-pointer"
      >
        <img
          src="https://www.gstatic.com/mobilesdk/240501_mobilesdk/firebase_28dp.png"
          alt="Logo"
          className="h-8"
        />
        <span className="font-bold">FireChat</span>
      </div>
      <ul className="hidden md:flex items-center gap-10 text-sm">
        {links.map((link, index) => (
          <li key={index}>
            <div
              onClick={() => {
                navigate(link.href);
              }}
              className="cursor-pointer"
            >
              {link.label}
            </div>
          </li>
        ))}
        {user && (
          <>
            {privateLinks.map((link, index) => (
              <li key={index}>
                <div
                  onClick={() => {
                    navigate(link.href);
                  }}
                  className="cursor-pointer"
                >
                  {link.label}
                </div>
              </li>
            ))}
          </>
        )}
      </ul>

      <div className="flex items-center">
        {!user && (
          <>
            <Button
              onClick={() => {
                navigate("/login");
              }}
              variant="secondary"
              className="hidden md:block px-2"
            >
              Login
            </Button>
            <Button className="hidden md:block ml-2 mr-2">Get Started</Button>
          </>
        )}

        {user && (
          <div className="hidden md:block">
            <UserMenu />
          </div>
        )}

        <div className="flex md:hidden mr-2 items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5 rotate-0 scale-100" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {links.map((link, index) => (
                <DropdownMenuItem key={index}>
                  <div
                    onClick={() => {
                      navigate(link.href);
                    }}
                    className="cursor-pointer"
                  >
                    {link.label}
                  </div>
                </DropdownMenuItem>
              ))}

              {!user && (
                <>
                  <DropdownMenuItem>
                    <Button
                      onClick={() => {
                        navigate("/login");
                      }}
                      variant="secondary"
                      className="w-full text-sm"
                    >
                      Login
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button className="w-full text-sm">Get Started</Button>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* <ThemeToggle /> */}
      </div>
    </div>
  );
};

export default Navbar;
