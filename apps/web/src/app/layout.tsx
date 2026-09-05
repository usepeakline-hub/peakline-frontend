import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Toaster } from "@repo/ui/sonner";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import "./globals.css";

const dmSans = DM_Sans({
	variable: "--font-dm-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Peakline",
	description: "One wallet for simple digital payments.",
	manifest: "/favicon/site.webmanifest",
	icons: {
		icon: [
			{ url: "/favicon/favicon.svg", type: "image/svg+xml" },
			{ url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
		],
		apple: "/favicon/apple-touch-icon.png",
	},
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang="en" className={`${dmSans.variable} h-full antialiased`}>
			<body className="min-h-full flex flex-col">
				<ReactQueryProvider>
					{children}
					<Toaster />
				</ReactQueryProvider>
			</body>
		</html>
	);
}
