import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Input,
  Tooltip,
} from "@nextui-org/react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { SearchIcon, SunFilledIcon, MoonFilledIcon } from "@/components/icons";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useTheme } from "next-themes";
import { clsx } from "clsx";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(debouncedSearch.trim())}`);
    }
  }, [debouncedSearch, navigate]);

  if (!mounted) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <NextUINavbar 
      maxWidth="xl" 
      position="sticky"
      className="bg-background/70 dark:bg-background/70 backdrop-blur-lg backdrop-saturate-150 border-b border-divider"
    >
      <NavbarBrand>
        <RouterLink to="/" className="font-bold text-inherit flex items-center gap-2">
          <span className="text-primary">filmyuk</span>
        </RouterLink>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link 
            as={RouterLink} 
            to="/" 
            color={isActive("/") ? "primary" : "foreground"}
            className={clsx(
              "font-medium",
              isActive("/") && "font-bold"
            )}
          >
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            as={RouterLink} 
            to="/favorites" 
            color={isActive("/favorites") ? "primary" : "foreground"}
            className={clsx(
              "font-medium",
              isActive("/favorites") && "font-bold"
            )}
          >
            Favorites
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end" className="gap-2">
        <NavbarItem className="hidden sm:flex">
          <Input
            classNames={{
              base: "max-w-full sm:max-w-[15rem] h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20 hover:bg-default-400/30 dark:hover:bg-default-500/30",
            }}
            placeholder="Search movies..."
            size="sm"
            startContent={<SearchIcon size={18} className="text-default-400" />}
            type="search"
            value={searchInput}
            onValueChange={setSearchInput}
          />
        </NavbarItem>
        <NavbarItem>
          <Tooltip content={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            <Button
              isIconOnly
              variant="light"
              aria-label="Toggle theme"
              className="bg-default-100 dark:bg-default-50"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <MoonFilledIcon size={22} className="text-default-500" />
              ) : (
                <SunFilledIcon size={22} className="text-default-500" />
              )}
            </Button>
          </Tooltip>
        </NavbarItem>
        <NavbarItem className="sm:hidden">
          <Button
            isIconOnly
            variant="light"
            className="bg-default-100 dark:bg-default-50"
            onClick={() => navigate('/search')}
          >
            <SearchIcon className="text-default-500" />
          </Button>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
}
