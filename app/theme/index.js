import { defaultTheme } from "./default";
import { darkTheme } from "./dark";
import { createTheming } from "@callstack/react-theme-provider";

export const themes = {
  default: defaultTheme,
  dark: darkTheme
};

const { ThemeProvider, withTheme, useTheme } = createTheming(defaultTheme);

export { ThemeProvider, withTheme, useTheme };
