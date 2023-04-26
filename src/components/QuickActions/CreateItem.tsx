import LinkTag from "next/link";
import { GrAdd } from "react-icons/gr";

import { Category } from "types";

import styles from "./quickactions.module.scss";

export default function CreateItem({
  type,
  categoryId,
  onClick,
}: {
  type: "category" | "link";
  categoryId: Category["id"];
  onClick?: (event: any) => void; // FIXME: find good event type
}) {
  return (
    <LinkTag
      href={`/${type}/create${categoryId && `?categoryId=${categoryId}`}`}
      title={`Create ${type}`}
      className={styles["action"]}
      onClick={onClick && onClick}
    >
      <GrAdd />
    </LinkTag>
  );
}
