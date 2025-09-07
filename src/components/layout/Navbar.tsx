import Logo from "@/assets/icons/Logo";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModeToggle } from "./ModeToggler";
import { Link, useLocation } from "react-router";
import { useEffect, useState } from "react";
import {
  authApi,
  useLogoutMutation,
  useUserInfoQuery,
} from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";
import { role } from "@/constants/role";
import { LogOut, User, Settings } from "lucide-react";
import { toast } from "sonner";

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: "/", label: "Home", role: "PUBLIC" },
  { href: "/about", label: "About", role: "PUBLIC" },
  { href: "/features", label: "Features", role: "PUBLIC" },
  { href: "/contact", label: "Contact", role: "PUBLIC" },
  { href: "/faq", label: "FAQ", role: "PUBLIC" },

  { href: "/admin", label: "Dashboard", role: role.admin },
  { href: "/admin", label: "Dashboard", role: role.superAdmin },
  { href: "/rider", label: "Dashboard", role: role.rider },
  { href: "/driver", label: "Dashboard", role: role.driver },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { data } = useUserInfoQuery(undefined);
  const location = useLocation();
  const currentPath = location.pathname;

  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await logout(undefined);
    dispatch(authApi.util.resetApiState());
    toast.success("Logged out successfully");
  };

  // Get user's first character for avatar fallback
  const getUserInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Check if user has Google profile picture
  const hasGooglePicture = data?.data?.auths?.some(
    (auth) => auth.provider === "google"
  );

  // Sticky + scroll-aware background/shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm supports-[backdrop-filter]:bg-background/60"
          : "bg-transparent backdrop-blur-0"
      }`}
    >
      <div className="container mx-auto px-4 flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks
                    .filter(
                      (link) =>
                        link.role === "PUBLIC" || link.role === data?.data?.role
                    )
                    .map((link) => (
                      <NavigationMenuItem
                        key={`${link.href}-${link.role}`}
                        className="w-full"
                      >
                        <NavigationMenuLink asChild className="w-full">
                          <Link
                            to={link.href}
                            className={`flex items-center gap-3 py-2 px-3 rounded-md transition-colors
      ${
        currentPath === link.href
          ? "bg-primary/10  border-primary font-semibold text-primary"
          : "text-muted-foreground hover:bg-accent/10"
      }`}
                          >
                            {link.label}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>

          {/* Main nav */}
          <div className="flex items-center gap-6">
            <Link to="/" className="text-primary hover:text-primary/90">
              <span className="inline-flex items-center gap-2">
                {/* <Logo /> */}
                <Logo size={50} />
                <span className="hidden sm:inline text-base font-semibold text-foreground">
                  RideExpress
                </span>
              </span>
            </Link>
            {/* Navigation menu */}
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks
                  .filter(
                    (link) =>
                      link.role === "PUBLIC" || link.role === data?.data?.role
                  )
                  .map((link) => (
                    <NavigationMenuItem key={`${link.href}-${link.role}`}>
                      <NavigationMenuLink
                        asChild
                        className="py-1.5 font-medium transition-colors"
                      >
                        <Link
                          to={link.href}
                          className={`relative 
      ${
        currentPath === link.href
          ? "text-foreground font-semibold after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-primary"
          : "text-muted-foreground hover:text-primary"
      }
    `}
                        >
                          {link.label}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <div className="py-2">
            <div className="flex items-center gap-2">
              <ModeToggle />
            </div>
          </div>
          {/* User Avatar Dropdown or Login Button */}
          {data?.data?.email ? (
            <TooltipProvider>
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full p-0 hover:bg-accent transition-colors"
                      >
                        {/* <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={data.data.picture || ""}
                            alt={data.data.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                            {getUserInitial(data.data.name)}
                          </AvatarFallback>
                        </Avatar> */}
                        <Avatar className="h-10 w-10">
                          {data?.data?.picture ? (
                            <AvatarImage
                              src={data.data.picture}
                              alt={data.data.name}
                              className="object-cover"
                            />
                          ) : null}
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                            {getUserInitial(data?.data?.name || "U")}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{data.data.name}</p>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent
                  className="w-80 p-4"
                  align="end"
                  sideOffset={8}
                >
                  {/* User Info Section */}
                  <div className="flex items-center gap-3 pb-3">
                    {/* <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={data.data.picture || ""}
                        alt={data.data.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                        {getUserInitial(data.data.name)}
                      </AvatarFallback>
                    </Avatar> */}

                    <Avatar className="h-12 w-12">
                      {data?.data?.picture ? (
                        <AvatarImage
                          src={data.data.picture}
                          alt={data.data.name}
                          className="object-cover"
                        />
                      ) : null}
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                        {getUserInitial(data?.data?.name || "U")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {data.data.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {data.data.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          {data.data.role}
                        </span>
                        {hasGooglePicture && (
                          <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/20 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                            Google
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  {/* Quick Actions */}
                  <div className="py-2">
                    <div className="flex items-center gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link to="/settings">Account</Link>
                      </Button>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  {/* Actions */}
                  <div className="space-y-1">
                    <DropdownMenuItem asChild>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/settings"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipProvider>
          ) : (
            <Button asChild className="text-sm font-medium">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
