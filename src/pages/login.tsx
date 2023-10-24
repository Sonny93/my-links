import { Provider } from "next-auth/providers";
import { getProviders, signIn } from "next-auth/react";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";

import ButtonLink from "components/ButtonLink";
import MessageManager from "components/MessageManager/MessageManager";
import PageTransition from "components/PageTransition";

import PATHS from "constants/paths";
import getUser from "lib/user/getUser";
import { getSession } from "utils/session";

import styles from "styles/login.module.scss";

interface SignInProps {
  providers: Provider[];
}
export default function SignIn({ providers }: SignInProps) {
  return (
    <div className={styles["login-page"]}>
      <PageTransition className={styles["login-container"]}>
        <NextSeo title="Authentification" />
        <div className={styles["image-wrapper"]}>
          <Image
            src={"/logo-light.png"}
            width={300}
            height={100}
            alt="MyLinks's logo"
          />
        </div>
        <div className={styles["form-wrapper"]}>
          <h1>Authentification</h1>
          <MessageManager info="Authentification requise pour utiliser ce service" />
          {Object.values(providers).map(({ name, id }) => (
            <ButtonLink
              onClick={() => signIn(id, { callbackUrl: PATHS.HOME })}
              className={styles["login-button"]}
              key={id}
            >
              <FcGoogle size={"1.5em"} /> Continuer avec {name}
            </ButtonLink>
          ))}
        </div>
      </PageTransition>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession(req, res);
  const user = await getUser(session);
  if (user) {
    return {
      redirect: {
        destination: PATHS.HOME,
      },
    };
  }

  const providers = await getProviders();
  return {
    props: { session, providers },
  };
}