import { Home, History, Images, BookOpen, User, LogOut, Menu } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "History", url: "/history", icon: History },
  { title: "Gallery", url: "/storage", icon: Images },
  { title: "Prompts", url: "/prompts", icon: BookOpen },
  { title: "Profile", url: "/profile", icon: User },
];

export function TopNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const getNavCls = (isActive: boolean) =>
    `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
      isActive
        ? "bg-primary/20 text-primary font-medium"
        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logo} alt="PIXARIS" className="w-10 h-10" />
            <div className="hidden sm:block">
              <h2 className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                PIXARIS
              </h2>
              <p className="text-xs text-muted-foreground -mt-1">Craft Your Vision</p>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.url;
              return (
                <NavLink
                  key={item.url}
                  to={item.url}
                  className={getNavCls(isActive)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.title}</span>
                </NavLink>
              );
            })}
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="ml-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="text-sm">Logout</span>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <img src={logo} alt="PIXARIS" className="w-8 h-8" />
                  <div>
                    <div className="font-bold bg-gradient-primary bg-clip-text text-transparent">
                      PIXARIS
                    </div>
                    <div className="text-xs text-muted-foreground font-normal">
                      Craft Your Vision
                    </div>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.url;
                  return (
                    <NavLink
                      key={item.url}
                      to={item.url}
                      onClick={() => setMobileMenuOpen(false)}
                      className={getNavCls(isActive)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  );
                })}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10 mt-2"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
