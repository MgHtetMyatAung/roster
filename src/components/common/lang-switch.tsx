import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { LANG_KEY } from "@/i18n/config";

type Props = {
  variant?: "default" | "ghost" | "outline";
};

export function LanguageToggle({ variant = "outline" }: Props) {
  const { i18n } = useTranslation();

  const currentLang = i18n.language as "en" | "mm";
  const isMyanmar = currentLang === "mm";

  const handleToggle = () => {
    const nextLang = isMyanmar ? "en" : "mm";
    i18n.changeLanguage(nextLang);
    localStorage.setItem(LANG_KEY, nextLang);
  };

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={handleToggle}
      className="cursor-pointer relative overflow-hidden"
    >
      <span className="text-xs font-semibold">{isMyanmar ? "EN" : "MM"}</span>

      <span className="sr-only">
        Switch to {isMyanmar ? "English" : "Myanmar"} language
      </span>
    </Button>
  );
}
