import { useState } from "react";
import { About } from "./components/About";
import { Achievements } from "./components/Achievements";
import { BackToTop } from "./components/BackToTop";
import { Contact } from "./components/Contact";
import { Events } from "./components/Events";
import { Footer } from "./components/Footer";
import { Gallery } from "./components/Gallery";
import { HelpHolders } from "./components/HelpHolders";
import { Hero } from "./components/Hero";
import { JoinUs } from "./components/JoinUs";
import { Navbar } from "./components/Navbar";
import { Projects } from "./components/Projects";
import { ScrollProgress } from "./components/ScrollProgress";
import { Stats } from "./components/Stats";
import { Team } from "./components/Team";
import { AdminPanel } from "./components/ui/AdminPanel";
import { AuthModal } from "./components/ui/AuthModal";
import { Cursor } from "./components/ui/Cursor";
import { IntroSplash } from "./components/ui/IntroSplash";
import { AuthProvider } from "./store/auth";
import { ContentProvider } from "./store/content";

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <AuthProvider>
      <ContentProvider>
        <a
          href="#about"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-navy-950 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>

        <IntroSplash />
        <ScrollProgress />
        <Cursor />
        <Navbar
          onOpenAuth={() => setAuthOpen(true)}
          onOpenAdmin={() => setAdminOpen(true)}
        />

        <main>
          <Hero />
          <About />
          <Stats />
          <Team />
          <Events />
          <Projects />
          <Gallery />
          <Achievements />
          <HelpHolders />
          <JoinUs />
          <Contact />
        </main>

        <Footer />
        <BackToTop />

        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
        <AdminPanel
          open={adminOpen}
          onClose={() => setAdminOpen(false)}
          onOpenAuth={() => setAuthOpen(true)}
        />
      </ContentProvider>
    </AuthProvider>
  );
}
