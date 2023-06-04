import axios from "axios";
import { useRouter } from "next/router";
import nProgress from "nprogress";
import { useMemo, useState } from "react";

import Checkbox from "components/Checkbox";
import FormLayout from "components/FormLayout";
import PageTransition from "components/PageTransition";
import Selector from "components/Selector";
import TextBox from "components/TextBox";

import useAutoFocus from "hooks/useAutoFocus";
import { Category, Link } from "types";
import { HandleAxiosError, IsValidURL } from "utils/front";
import { getSession } from "utils/session";

import getUserCategories from "lib/category/getUserCategories";
import getUserLink from "lib/link/getUserLink";

import PATHS from "constants/paths";
import getUser from "lib/user/getUser";
import styles from "styles/create.module.scss";

function EditLink({
  link,
  categories,
}: {
  link: Link;
  categories: Category[];
}) {
  const autoFocusRef = useAutoFocus();
  const router = useRouter();

  const [name, setName] = useState<string>(link.name);
  const [url, setUrl] = useState<string>(link.url);
  const [favorite, setFavorite] = useState<boolean>(link.favorite);
  const [categoryId, setCategoryId] = useState<number | null>(
    link.category?.id || null
  );

  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const canSubmit = useMemo<boolean>(() => {
    const isFormEdited =
      name !== link.name ||
      url !== link.url ||
      favorite !== link.favorite ||
      categoryId !== link.category.id;
    const isFormValid =
      name !== "" &&
      IsValidURL(url) &&
      favorite !== null &&
      categoryId !== null;
    return isFormEdited && isFormValid && !submitted;
  }, [
    categoryId,
    favorite,
    link.category.id,
    link.favorite,
    link.name,
    link.url,
    name,
    submitted,
    url,
  ]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSubmitted(true);
    nProgress.start();

    try {
      const payload = { name, url, favorite, categoryId };
      const { data } = await axios.put(`${PATHS.API.LINK}/${link.id}`, payload);
      router.push(`${PATHS.HOME}?categoryId=${data?.categoryId}`);
      setSubmitted(true);
    } catch (error) {
      setError(HandleAxiosError(error));
      setSubmitted(false);
    } finally {
      nProgress.done();
    }
  };

  return (
    <PageTransition className="page-link-edit">
      <FormLayout
        title="Modifier un lien"
        errorMessage={error}
        canSubmit={canSubmit}
        handleSubmit={handleSubmit}
      >
        <TextBox
          name="name"
          label="Nom"
          onChangeCallback={(value) => setName(value)}
          value={name}
          fieldClass={styles["input-field"]}
          placeholder={`Nom original : ${link.name}`}
          innerRef={autoFocusRef}
        />
        <TextBox
          name="url"
          label="URL"
          onChangeCallback={(value) => setUrl(value)}
          value={url}
          fieldClass={styles["input-field"]}
          placeholder={`URL original : ${link.url}`}
        />
        <Selector
          name="category"
          label="Catégorie"
          value={categoryId}
          onChangeCallback={(value: number) => setCategoryId(value)}
          options={categories.map(({ id, name }) => ({
            label: name,
            value: id,
          }))}
        />
        <Checkbox
          name="favorite"
          isChecked={favorite}
          onChangeCallback={(value) => setFavorite(value)}
          label="Favoris"
        />
      </FormLayout>
    </PageTransition>
  );
}

EditLink.authRequired = true;
export default EditLink;

export async function getServerSideProps({ req, res, query }) {
  const { lid } = query;

  const session = await getSession(req, res);
  const user = await getUser(session);
  if (!user) {
    return {
      redirect: {
        destination: PATHS.HOME,
      },
    };
  }

  const categories = await getUserCategories(user);
  const link = await getUserLink(user, Number(lid));
  if (!link) {
    return {
      redirect: {
        destination: PATHS.HOME,
      },
    };
  }

  return {
    props: {
      link: JSON.parse(JSON.stringify(link)),
      categories: JSON.parse(JSON.stringify(categories)),
    },
  };
}
