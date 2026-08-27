import SiteNav from "@/components/navigation/SiteNav";
import Footer from "@/components/footer/FooterServer";
import Hero2Optimized from "@/components/sections/Hero2Optimized/Hero2Optimized";
import { NAV_PROPS, FOOTER_LINKS, ROUTES } from "@/lib/site";

export default function NotFound() {
  return (
    <>
      <SiteNav {...NAV_PROPS} fill="rgb(249, 251, 255)" fill2="rgb(249, 251, 255)" />
      <Hero2Optimized
        realisationsHref={ROUTES.realisations}
        bookingHref={ROUTES.contact}
        title="Oups, cette page n’existe pas"
        subtitle="La page que vous cherchez a été déplacée ou n’existe plus. Retournez à l’accueil ou réservez un appel avec l’équipe."
        secondaryCtaLabel="Retour à l’accueil"
        secondaryCtaHref={ROUTES.home}
        primaryCtaLabel="Réserver un appel"
        primaryCtaHref={ROUTES.contact}
      />
      <Footer
        bookingHref={ROUTES.contact}
        links={FOOTER_LINKS}
        visible={false}
        padding="96px 48px 64px 48px"
      />
    </>
  );
}
