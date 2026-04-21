import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { ROUTE_NAMES } from "@/constants/route.names";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation("auth");
  return (
    <div className={cn("max-w-100 mx-auto", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="px-0 md:px-4">
          <form className="p-6">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">{t("register_title")}</h1>
                <p className="text-muted-foreground text-balance">
                  {t("register_description")}
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="name">{t("name")}</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
                <Input id="password" type="password" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm_password">{t("confirm_password")}</FieldLabel>
                <Input id="confirm_password" type="password" required />
              </Field>
              <Field>
                <Button type="submit" className="w-full cursor-pointer">
                  {t("register")}
                </Button>
              </Field>
              <div className="text-center text-sm">
                {t("already_have_account")}{" "}
                <Link to={`/auth/${ROUTE_NAMES.LOGIN}`} className="underline underline-offset-4">
                  {t("sign_in")}
                </Link>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
