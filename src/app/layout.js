import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import BackgroundProvider from "./components/BackgroundProvider";
import { ThemeProvider } from "./contexts/ThemeContext";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Meet Nirvek",
  description: "Introducing Nirvek Pandey",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} font-montserrat antialiased min-h-dvh`}
      >
        <ThemeProvider>
          <BackgroundProvider>
            <Header />
            {children}
          </BackgroundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
