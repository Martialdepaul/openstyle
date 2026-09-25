import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Le back-office (/admin) est hors du segment de langue (section 3 du
  // cahier des charges) : il ne doit jamais passer par ce proxy.
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
