import { LocaleArr } from "@/types/Locale";
import { MetadataRoute } from "next";

const BASE_URL = "https://ztomato.vercel.app";

const staticPaths = [
  "",
  "/main",
  "/main/signin",
  "/main/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return staticPaths.flatMap((path) =>
    LocaleArr.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      alternates: {
        languages: Object.fromEntries(
          LocaleArr.map((l) => [l, `${BASE_URL}/${l}${path}`])
        ),
      },
    }))
  );
}
