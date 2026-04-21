import { Button } from "@/components/ui/button";
import { ROUTE_LINKS } from "@/constants/route.links";
import { getUrl } from "@/lib/route_logic";
import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <section className=" min-d-h grid place-items-center">
      <div className=" text-center space-y-3">
        <h2 className=" text-5xl text-red-400 font-light">404</h2>
        <h3 className=" text-lg text-muted-foreground">Page Not Found</h3>
        <Link to={getUrl(ROUTE_LINKS.DASHBOARD)}>
          <Button
            size={"lg"}
            variant={"default"}
            className=" rounded-full px-5 cursor-pointer"
          >
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </section>
  );
}
