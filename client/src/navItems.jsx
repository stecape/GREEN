import { ReactNode } from "react";
import { LayoutNavigationItem, LayoutNavigationTree } from "@react-md/layout";
import { HomeSVGIcon, AllInclusiveSVGIcon, AllOutSVGIcon, SettingsInputComponentSVGIcon } from "@react-md/material-icons";

/**
 * Note: The `parentId` **must** be defaulted to `null` for the navigation tree
 * to render correctly since this uses the @react-md/tree package behind the
 * scenes. Each item that has a `parentId` set to `null` will appear at the root
 * level of your navigation tree.
 */
function createRoute(
  pathname: string,
  children: string,
  leftAddon: ReactNode | undefined,
  parentId: string | null = null
): LayoutNavigationItem {
  return {
    itemId: pathname,
    parentId,
    to: pathname,
    children,
    leftAddon,
  };
}

const navItems: LayoutNavigationTree = {
  "/": createRoute("/", "Home", <HomeSVGIcon />),
  "/types": createRoute("/types", "Types", <AllOutSVGIcon />),
  "/vars": createRoute("/vars", "Vars", <AllInclusiveSVGIcon />),
  "/tags": createRoute("/tags", "Tags", <SettingsInputComponentSVGIcon />),
};

export default navItems;