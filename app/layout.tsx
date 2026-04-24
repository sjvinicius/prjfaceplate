import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Image from "next/image"

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const geistQuickSand = Quicksand({
  variable: "--font-geist-quicksand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FacePlate",
  description: "Criado por Grupo 1 - Ciências da Computação",
};

export default function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        className={`${geistQuickSand.variable} antialiased`}
        style={{ background: "linear-gradient(121.61deg, #4292ED 0.55%, #ED4242 99.45%)" }}
      >
        <div className="flex-1 mr-10">
                    
          <Image
            src="/image.png"
            alt="descricao"
            width={500}
            height={300}
          />
            <Image
              src="/leftbg.svg"
              alt="background esquerdo"
              fill
              style={{
                objectFit: "contain",
                objectPosition: "left",
                zIndex: -1
              }}
              priority
            />
      
            <Image
              src="/rightbg.svg"
              alt="background direito"
              fill
              style={{
                objectFit: "contain",
                objectPosition: "right",
                zIndex: -1
              }}
            />
          {children}
        </div>

        <div className={`asideright fixed right-0 top-0 h-screen w-16 flex flex-col`}>
          <div className="clip-path-bottom bg-[var(--secondary)]" style={{ flex: "1.5" }}>
            <div className="aside-hover">Cinza</div>
          </div>

          <div className="aside-block bg-[var(--background)]" style={{ marginTop: "-50px" }}>
            <div className="aside-hover" style={{ color: "#000" }}>Branco</div>
          </div>

          <div className="aside-block bg-[var(--tertiary)]">
            <div className="aside-hover">Vermelho</div>
          </div>

          <div className="aside-block bg-[var(--primary)]">
            <div className="aside-hover">Azul</div>
          </div>

          <div className="aside-block black clip-path-top bg-[var(--foreground)]">
            <div className="aside-hover">Preto</div>
          </div>
        </div>

        <Toaster />
      </body>
    </html>
  );
}
