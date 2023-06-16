import { User } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

import ButtonLink from "components/ButtonLink";

import styles from "./user-card.module.scss";

export default function UserCard({ user }: { user: User }) {
  const { data } = useSession({ required: true });
  return (
    <div className={styles["user-card-wrapper"]}>
      <div className={styles["user-card"]}>
        <Image
          src={data.user.image}
          width={28}
          height={28}
          alt={`${data.user.name}'s avatar`}
        />
        {data.user.name}
      </div>
      <div style={{ display: "flex", gap: ".75em", alignItems: "center" }}>
        {user.is_admin && (
          <ButtonLink href="/admin" className={`reset ${styles["admin"]}`}>
            <MdOutlineAdminPanelSettings size={24} />
          </ButtonLink>
        )}
        <ButtonLink onClick={signOut} className="reset">
          <FiLogOut size={24} />
        </ButtonLink>
      </div>
    </div>
  );
}
