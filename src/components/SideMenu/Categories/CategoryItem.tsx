import { AiFillFolderOpen, AiOutlineFolder } from "react-icons/ai";
import { Category } from "types";
import styles from "./categories.module.scss";
import LinkTag from "next/link";

interface CategoryItemProps {
  category: Category;
  categoryActive: Category;
}

export default function CategoryItem({
  category,
  categoryActive
}: CategoryItemProps): JSX.Element {
  const className = `${styles["item"]} ${
    category.id === categoryActive.id ? styles["active"] : ""
  }`;

  return (
    <LinkTag href={`/?categoryId=${category.id}`} className={className}>
      {category.id === categoryActive.id ? (
        <AiFillFolderOpen size={24} />
      ) : (
        <AiOutlineFolder size={24} />
      )}

      <div className={styles["content"]}>
        <span className={styles["name"]}>{category.name}</span>
        <span className={styles["links-count"]}>— {category.links.length}</span>
      </div>
    </LinkTag>
  );
}
