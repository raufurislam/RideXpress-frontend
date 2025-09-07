import Logo from "@/assets/icons/Logo";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { role as ROLE } from "@/constants/role";

export default function Footer() {
  const { data } = useUserInfoQuery(undefined);
  const user = data?.data;
  const userRole = user?.role;

  const isGuest = !user?.email;

  const guestLinks = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/features" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const riderLinks = [
    { label: "Request a ride", href: "/rider/request-ride" },
    { label: "Ride history", href: "/rider/ride-history" },
    { label: "Active ride", href: "/rider/active-ride" },
  ];

  const driverLinks = [
    { label: "Get rides", href: "/driver/get-ride" },
    { label: "Earnings", href: "/driver/driver-earning" },
    { label: "Ride history", href: "/driver/ride-history" },
  ];

  const adminLinks = [
    { label: "Analytics", href: "/admin/analytics" },
    { label: "All users", href: "/admin/all-user" },
    { label: "All drivers", href: "/admin/all-driver" },
    { label: "All rides", href: "/admin/all-rides" },
  ];

  const accountLinks = isGuest
    ? [
        { label: "Sign in", href: "/login" },
        { label: "Register", href: "/register" },
      ]
    : [
        { label: "Profile", href: "/profile" },
        { label: "Settings", href: "/settings" },
      ];

  const roleNav = isGuest
    ? guestLinks
    : userRole === ROLE.rider
    ? riderLinks
    : userRole === ROLE.driver
    ? driverLinks
    : adminLinks;

  return (
    <footer className="border-t">
      <div className="mx-auto container px-4 py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              {/* <Logo /> */}
              <Logo size={60} />
              <p className="text-foreground font-medium">Ride Express</p>
            </div>
            <p className="mt-4 max-w-sm text-muted-foreground">
              Reliable rides for everyone. Transparent pricing, verified
              drivers, and real-time tracking—built for speed, safety, and
              comfort.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:col-span-2">
            <div>
              <p className="font-medium text-foreground">Navigation</p>
              <ul className="mt-4 space-y-3 text-sm">
                {roleNav.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="text-foreground/90 hover:text-foreground"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-medium text-foreground">Account</p>
              <ul className="mt-4 space-y-3 text-sm">
                {accountLinks.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="text-foreground/90 hover:text-foreground"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-medium text-foreground">Resources</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a
                    href="/faq"
                    className="text-foreground/90 hover:text-foreground"
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-foreground/90 hover:text-foreground"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="/features"
                    className="text-foreground/90 hover:text-foreground"
                  >
                    Features
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} RideExpress. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="/terms" className="hover:text-foreground">
              Terms
            </a>
            <span>•</span>
            <a href="/privacy" className="hover:text-foreground">
              Privacy
            </a>
            <span>•</span>
            <a href="/unauthorized" className="hover:text-foreground">
              Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
