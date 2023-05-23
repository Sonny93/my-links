import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import { useRouter } from "next/router";
import nProgress from "nprogress";
import { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import AuthRequired from "components/AuthRequired";
import * as Keys from "constants/keys";

import "nprogress/nprogress.css";
import "styles/globals.scss";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();

  useHotkeys(Keys.CLOSE_SEARCH_KEY, () => router.push("/"), {
    enabled: router.pathname !== "/",
    enableOnFormTags: ["INPUT"],
  });

  useEffect(() => {
    // Chargement pages
    router.events.on("routeChangeStart", nProgress.start);
    router.events.on("routeChangeComplete", nProgress.done);
    router.events.on("routeChangeError", nProgress.done);

    return () => {
      router.events.off("routeChangeStart", nProgress.start);
      router.events.off("routeChangeComplete", nProgress.done);
      router.events.off("routeChangeError", nProgress.done);
    };
  }, [router.events]);

  return (
    <SessionProvider session={session}>
      <DefaultSeo titleTemplate="MyLinks — %s" defaultTitle="MyLinks" />
      {Component.authRequired ? (
        <AuthRequired>
          <Component {...pageProps} />
        </AuthRequired>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
}

export default MyApp;
