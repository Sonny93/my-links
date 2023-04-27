import axios from "axios";
import LinkTag from "next/link";
import { AiFillStar } from "react-icons/ai";

import { Link } from "types";

import EditItem from "components/QuickActions/EditItem";
import FavoriteItem from "components/QuickActions/FavoriteItem";
import RemoveItem from "components/QuickActions/RemoveItem";
import LinkFavicon from "./LinkFavicon";

import styles from "./links.module.scss";

export default function LinkItem({
  link,
  toggleFavorite,
}: {
  link: Link;
  toggleFavorite: (linkId: Link["id"]) => void;
}) {
  const { id, name, url, favorite } = link;
  const onFavorite = () => {
    const payload = {
      name,
      url,
      favorite: !favorite,
      categoryId: link.category.id,
    };
    axios
      .put(`/api/link/edit/${link.id}`, payload)
      .then(() => toggleFavorite(link.id))
      .catch(console.error);
  };

  return (
    <li className={styles["link"]} key={id}>
      <LinkFavicon url={url} />
      <LinkTag href={url} target={"_blank"} rel={"noreferrer"}>
        <span className={styles["link-name"]}>
          {name} {favorite && <AiFillStar color="#ffc107" />}
        </span>
        <LinkItemURL url={url} />
      </LinkTag>
      <div className={styles["controls"]}>
        <FavoriteItem isFavorite={favorite} onClick={onFavorite} />
        <EditItem type="link" id={id} />
        <RemoveItem type="link" id={id} />
      </div>
    </li>
  );
}

function LinkItemURL({ url }: { url: Link["url"] }) {
  try {
    const { origin, pathname, search } = new URL(url);
    let text = "";

    if (pathname !== "/") {
      text += pathname;
    }

    if (search !== "") {
      if (text === "") {
        text += "/";
      }
      text += search;
    }

    return (
      <span className={styles["link-url"]}>
        {origin}
        <span className={styles["url-pathname"]}>{text}</span>
      </span>
    );
  } catch (error) {
    console.error("error", error);
    return <span className={styles["link-url"]}>{url}</span>;
  }
}
