import { FC, useState, useEffect } from "react";
import { Switch } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

export const ThemeSwitch: FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Switch
      defaultSelected={theme === "light"}
      size="lg"
      color="secondary"
      startContent={<SunFilledIcon />}
      endContent={<MoonFilledIcon />}
      onChange={(isSelected) => setTheme(isSelected ? "light" : "dark")}
    />
  );
};
