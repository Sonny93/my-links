import axios from "axios";
import { useRouter } from "next/router";
import nProgress from "nprogress";
import { useMemo, useState } from "react";

import Checkbox from "components/Checkbox";
import FormLayout from "components/FormLayout";
import PageTransition from "components/PageTransition";
import TextBox from "components/TextBox";

import PATHS from "constants/paths";
import getUserCategory from "lib/category/getUserCategory";
import getUser from "lib/user/getUser";
import { Category } from "types";
import { HandleAxiosError } from "utils/front";
import { getSession } from "utils/session";

import styles from "styles/form.module.scss";

function RemoveCategory({ category }: { category: Category }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(
    category.links.length > 0
      ? "Vous devez supprimer tous les liens de cette catégorie avant de pouvoir supprimer cette catégorie"
      : null
  );
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const canSubmit = useMemo<boolean>(
    () => category.links.length === 0 && confirmDelete && !submitted,
    [category.links.length, confirmDelete, submitted]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSubmitted(true);
    nProgress.start();

    try {
      await axios.delete(`${PATHS.API.CATEGORY}/${category.id}`);
      router.push(PATHS.HOME);
      setSubmitted(true);
    } catch (error) {
      setError(HandleAxiosError(error));
      setSubmitted(false);
    } finally {
      nProgress.done();
    }
  };

  return (
    <PageTransition className={styles["form-container"]}>
      <FormLayout
        title="Supprimer une catégorie"
        categoryId={category.id.toString()}
        errorMessage={error}
        canSubmit={canSubmit}
        handleSubmit={handleSubmit}
        classBtnConfirm="red-btn"
        textBtnConfirm="Supprimer"
      >
        <TextBox
          name="name"
          label="Nom"
          value={category.name}
          fieldClass={styles["input-field"]}
          disabled={true}
        />
        <Checkbox
          name="confirm-delete"
          label="Confirmer la suppression ?"
          isChecked={confirmDelete}
          disabled={!!error}
          onChangeCallback={(checked) => setConfirmDelete(checked)}
        />
      </FormLayout>
    </PageTransition>
  );
}

RemoveCategory.authRequired = true;
export default RemoveCategory;

export async function getServerSideProps({ req, res, query }) {
  const { cid } = query;

  const session = await getSession(req, res);
  const user = await getUser(session);
  if (!user) {
    return {
      redirect: {
        destination: PATHS.HOME,
      },
    };
  }

  const category = await getUserCategory(user, Number(cid));
  if (!category) {
    return {
      redirect: {
        destination: PATHS.HOME,
      },
    };
  }

  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
    },
  };
}
