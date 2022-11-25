import { ReactElement, useRef, useLayoutEffect } from "react";
import { Layout, useLayoutNavigation } from "@react-md/layout";
import { useCrossFadeTransition } from "@react-md/transition";
import { useLocation, Link } from "react-router-dom";

import navItems from "./navItems";

import App from "./App";

export default function MyLayout(): ReactElement {
  const { pathname } = useLocation();
  const prevPathname = useRef(pathname);
  const { elementProps, transitionTo } = useCrossFadeTransition();
  useLayoutEffect(() => {
        if (pathname === prevPathname.current) {
          return
        }
    
        prevPathname.current = pathname;
        transitionTo('enter');
      }, [pathname, transitionTo])

  return (
    <Layout
      title="Green"
      navHeaderTitle="Menu"
      treeProps={useLayoutNavigation(navItems, pathname, Link)}
      mainProps={elementProps}
    >
      <App />
    </Layout>
  );
}