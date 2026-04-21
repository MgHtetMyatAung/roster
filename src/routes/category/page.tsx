import { useTranslation } from "react-i18next";

export default function CategoryPage() {
  const { t } = useTranslation();
  return (
    <div>
      CategoryPage
      <p>{t("common.welcome")}</p>
    </div>
  );
}
