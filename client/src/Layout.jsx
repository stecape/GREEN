import { useRef } from "react";
import {
  Layout,
  useLayoutNavigation,
  useCrossFadeTransition,
  useIsomorphicLayoutEffect
} from "react-md";
import { useLocation, Link } from "react-router-dom";

import navItems from "./navItems";

import App from "./App";

export default function MyLayout() {
  const { pathname } = useLocation();
  const prevPathname = useRef(pathname);
  const { elementProps, transitionTo } = useCrossFadeTransition();
  useIsomorphicLayoutEffect(() => {
        if (pathname === prevPathname.current) {
          return
        }
    
        prevPathname.current = pathname;
        transitionTo('enter');
      }, [pathname, transitionTo])

  return (
    <Layout
      title={<>Green - {pathname.replace("/", "").toUpperCase()}</>}
      navHeaderTitle="Menu"
      treeProps={useLayoutNavigation(navItems, pathname, Link)}
      mainProps={elementProps}
    >
      <App />
    </Layout>
  );
}