import { IntroLoader } from "@/components/loader/intro-loader";
import { InlineScript } from "@/components/shared/inline-script";
import { INTRO_STORAGE_KEY } from "@/lib/motion";

type TIntroGateProps = {
  name: string;
  tagline: string;
};

/**
 * Decides before first paint whether the intro should show: if it already
 * played this session, flag <html> so CSS hides the overlay instantly (no
 * flash). Without JS, the overlay and reveal-hidden content are forced
 * visible via <noscript>.
 */
export function IntroGate({ name, tagline }: TIntroGateProps) {
  const script = `try{if(sessionStorage.getItem(${JSON.stringify(
    INTRO_STORAGE_KEY
  )}))document.documentElement.setAttribute("data-intro-seen","")}catch(e){}`;

  return (
    <>
      <InlineScript html={script} />
      <noscript>
        <style>{`.intro-loader{display:none!important}[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
      </noscript>
      <IntroLoader name={name} tagline={tagline} />
    </>
  );
}
