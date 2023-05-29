import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";
import LinkFavicon from "./Links/LinkFavicon";
import UserCard from "./SideMenu/UserCard/UserCard";

export default function PageTransition({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      style={{
        display: "grid",
        gridTemplateColumns: "350px 1fr",
        gridTemplateRows: "2em 1fr 2em",
        gap: "1em 0",
      }}
    >
      <Navbar />

      {children}
      <FloatingFavoritesBar />
    </motion.div>
  );
}

function Navbar() {
  return (
    <nav
      style={{
        gridArea: "1 / 1 / 2 / 3",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <ul
        style={{
          gridArea: "1 / 1 / 2 / 3",
          display: "flex",
          gap: "1em",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <li style={{ fontSize: "1.5em" }}>
          <Link href="/">MyLinks</Link>
        </li>
        <li>
          <Link href="/">Ajouter un lien</Link>
        </li>
        <li>
          <Link href="/">Ajouter une catégorie</Link>
        </li>
      </ul>
      <span style={{ width: "200px" }}>
        <UserCard />
      </span>
    </nav>
  );
}

function FloatingFavoritesBar() {
  return (
    <nav
      style={{
        width: "100%",
        gridArea: "3 / 1 / 4 / 3",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <ul
        style={{
          maxWidth: "100%",
          paddingBottom: ".25em",
          display: "flex",
          gap: "1em",
          alignItems: "center",
          // justifyContent: "center",
          overflow: "auto",
        }}
      >
        {[
          ["Google", "https://google.com"],
          ["Github", "https://github.com"],
          ["Mail", "https://mail.google.com"],
          ["portfolio", "https://www.sonny.dev"],
          ["Mon super lien de la mort qui tue", "https://google.com"],
          ["Mon super lien de la mort qui tue", "https://google.com"],
          ["Mon super lien de la mort qui tue", "https://google.com"],
          ["Mon super lien de la mort qui tue", "https://google.com"],
          ["Mon super lien de la mort qui tue", "https://google.com"],
          ["Mon super lien de la mort qui tue", "https://google.com"],
          ["Mon super lien de la mort qui tue", "https://google.com"],
        ].map(([name, value]) => (
          <li key={name}>
            <Link
              href="/"
              style={{
                width: "150px",
                padding: "0.25em .5em",
                backgroundColor: "#fff",
                border: "1px solid #dadce0",
                borderRadius: "10em",
                display: "flex",
                gap: ".2em",
                justifyContent: "center",
              }}
            >
              <LinkFavicon url={value} size={18} noMargin />
              <span
                style={{
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
