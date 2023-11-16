import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useRef } from "react";
import { Category } from "types";
import styles from "./categories.module.scss";
import { motion } from "framer-motion";
import CategoryItem from "./CategoryItem";

interface CategoriesProps {
  categories: Category[];
  categoryActive: Category;
  handleSelectCategory: (category: Category) => void;
}

export default function Categories({
  categories,
  categoryActive,
  handleSelectCategory
}: CategoriesProps) {
  const { t } = useTranslation();
  const itemsRef = useRef<Array<HTMLLIElement>>([]);
  const linksCount = useMemo(
    () => categories.reduce((acc, current) => (acc += current.links.length), 0),
    [categories]
  );

  console.log("render");
  useEffect(() => {
    itemsRef.current.forEach((ref) => {
      if (ref.id === categoryActive.id.toString()) {
        ref.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }, [categoryActive.id]);

  return (
    <div className={styles["categories"]}>
      <h4>
        {t("common:category.categories")} • {linksCount}
      </h4>
      <ul className={styles["items"]}>
        {categories.map((category, index) => (
          <motion.li
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 25,
              delay: index * 0.02,
              duration: 200
            }}
            style={{
              transition: "none"
            }}
            ref={el => itemsRef.current[index] = el}
            title={category.name}
            key={category.id}
            id={category.id.toString()}
          >
            <CategoryItem category={category} categoryActive={categoryActive} />
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
