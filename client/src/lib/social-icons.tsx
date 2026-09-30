import { Globe, Mail } from "lucide-react";
import {
  FaDev,
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaMedium,
  FaStackOverflow,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube
} from "react-icons/fa6";
import { SiCodeforces, SiHashnode, SiLeetcode } from "react-icons/si";

/** Maps a free-text platform name (from the CMS) to an icon. */
export function getSocialIcon(platform: string, size = 18) {
  const p = platform.toLowerCase();

  if (p.includes("github")) return <FaGithub size={size} />;
  if (p.includes("linkedin")) return <FaLinkedin size={size} />;
  if (p.includes("twitter") || p === "x") return <FaXTwitter size={size} />;
  if (p.includes("facebook")) return <FaFacebook size={size} />;
  if (p.includes("instagram")) return <FaInstagram size={size} />;
  if (p.includes("youtube")) return <FaYoutube size={size} />;
  if (p.includes("medium")) return <FaMedium size={size} />;
  if (p.includes("dev.to") || p === "dev") return <FaDev size={size} />;
  if (p.includes("hashnode")) return <SiHashnode size={size} />;
  if (p.includes("stack")) return <FaStackOverflow size={size} />;
  if (p.includes("leetcode")) return <SiLeetcode size={size} />;
  if (p.includes("codeforces")) return <SiCodeforces size={size} />;
  if (p.includes("discord")) return <FaDiscord size={size} />;
  if (p.includes("whatsapp")) return <FaWhatsapp size={size} />;
  if (p.includes("mail")) return <Mail size={size} />;

  return <Globe size={size} />;
}
