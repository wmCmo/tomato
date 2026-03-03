import '@/app/index.css';
import AppProviders from "@/providers/app-providers";
import type { Metadata, Viewport } from "next";
import { Montserrat, Pixelify_Sans, Zen_Maru_Gothic } from "next/font/google";

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
});

const zenMaruGothic = Zen_Maru_Gothic({
    variable: "--font-zen-maru-gothic",
    subsets: ["latin"],
    weight: ["300", "400", "500", "700", "900"]
});

const pixelifySans = Pixelify_Sans({
    variable: "--font-pixelify-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://ztomato.vercel.app"),
    title: "Zach's Tomato | Your Minimal Pomodoro Timer",
    description: "A minimal Pomodoro timer for free, forever.",
    applicationName: "Zach's Tomato",
    robots: "index,follow",
    manifest: "/manifest.webmanifest",
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "48x48" },
            { url: "/pwa-64x64.png", sizes: "64x64", type: "image/png" },
        ],
        apple: [
            { url: "/apple-touch-icon-180x180.png", sizes: "180x180" },
        ],
    },
    openGraph: {
        type: "website",
        siteName: "Zach's Tomato",
        title: "Zach's Tomato | Your Minimal Pomodoro Timer",
        description: "A minimal Pomodoro timer for free, forever.",
        url: "http://ztomato.vercel.app/",
        images: [{ url: "/og.png" }],
    },
    twitter: {
        card: "summary",
        title: "Zach's Tomato | Your Minimal Pomodoro Timer",
        description: "A minimal Pomodoro timer for free, forever.",
        images: ["/og.png"],
    },
    alternates: {
        canonical: "http://ztomato.vercel.app/",
    },
    verification: {
        google: [
            "1NxcUZ56BgzYt3fTTQd58nakOqAbsg6Qx4scYTCb0JM",
            "4mTRNZbiJxo2Uo3OIy2C3gIWyExvXZq3BHxpRk8s8mg",
        ],
    },
    appleWebApp: {
        capable: true,
        title: "Zach's Tomato",
        statusBarStyle: "default",
    },
    other: {
        "itemprop:name": "Zach's Tomato",
        "itemprop:description": "Your minimal Pomodoro timer",
        "itemprop:image": "https://github.com/user-attachments/assets/05d8c6a7-215b-4df5-9366-5e872de70a34",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    colorScheme: "light dark",
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#fafafa" },
        { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    ],
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Zach's Tomato",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web",
    description: "A minimal Pomodoro timer for free, forever.",
    inLanguage: ["en", "ja"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html suppressHydrationWarning>
            <body
                className={`${montserrat.variable} ${zenMaruGothic.variable} ${pixelifySans.variable} antialiased`}
                suppressHydrationWarning
            >
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <AppProviders>
                    {children}
                </AppProviders>
            </body>
        </html>
    );
}
