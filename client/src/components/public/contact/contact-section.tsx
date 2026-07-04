"use client";

import { Mail, MapPin, Phone, Send, Smartphone } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TContactInfo, TSocialLink } from "@/types/portfolio";
import { FaGithub, FaLinkedin } from "react-icons/fa";

type TContactSectionProps = {
  contactInfo: TContactInfo | null;
  socialLinks: TSocialLink[];
};

export function ContactSection({
  contactInfo,
  socialLinks,
}: TContactSectionProps) {
  const email = contactInfo?.email || "shahariarshawon.dev@gmail.com";
  const phone = contactInfo?.phone || "+880-1518-935876";
  const whatsapp = contactInfo?.whatsapp || "+880-1518-935876";
  const location = contactInfo?.location || "Uttara, Dhaka, Bangladesh";

  return (
    <section id="contact" className="section-padding border-t border-site">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Contact"
          title="Let’s build something professional together."
          description="Reach out for backend development, full-stack web applications, portfolio websites, debugging, or collaboration opportunities."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-4">
            <Card className="p-5">
              <div className="flex gap-4">
                <Mail className="text-accent" size={22} />
                <div>
                  <p className="font-semibold text-highlight">Email</p>
                  <a
                    href={`mailto:${email}`}
                    className="mt-1 block text-sm text-normal hover:text-accent"
                  >
                    {email}
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex gap-4">
                <Phone className="text-accent" size={22} />
                <div>
                  <p className="font-semibold text-highlight">Phone</p>
                  <a
                    href={`tel:${phone}`}
                    className="mt-1 block text-sm text-normal hover:text-accent"
                  >
                    {phone}
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex gap-4">
                <Smartphone className="text-accent" size={22} />
                <div>
                  <p className="font-semibold text-highlight">WhatsApp</p>
                  <a
                    href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block text-sm text-normal hover:text-accent"
                  >
                    {whatsapp}
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex gap-4">
                <MapPin className="text-accent" size={22} />
                <div>
                  <p className="font-semibold text-highlight">Location</p>
                  <p className="mt-1 text-sm text-normal">{location}</p>
                </div>
              </div>
            </Card>

            <div className="flex gap-3 pt-2">
              {socialLinks.map((link) => {
                const platform = link.platform.toLowerCase();

                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.platform}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-site bg-card text-highlight transition hover:border-(--color-accent) hover:text-accent"
                  >
                    {platform.includes("github") ? (
                      <FaGithub size={18} />
                    ) : platform.includes("linkedin") ? (
                      <FaLinkedin size={18} />
                    ) : (
                      <Mail size={18} />
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          <Card className="p-6 md:p-8">
            <h3 className="text-2xl font-bold text-highlight">
              Send a message
            </h3>

            <p className="mt-3 text-sm leading-7 text-normal">
              The form design is ready. In the contact-system phase, this will
              save messages to the database and send email notifications.
            </p>

            <form className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Your name"
                  className="rounded-2xl border border-site bg-transparent px-4 py-3 text-sm text-highlight outline-none transition placeholder:text-normal focus:border-(--color-accent)"
                />

                <input
                  type="email"
                  placeholder="Your email"
                  className="rounded-2xl border border-site bg-transparent px-4 py-3 text-sm text-highlight outline-none transition placeholder:text-normal focus:border-(--color-accent)"
                />
              </div>

              <input
                type="text"
                placeholder="Subject"
                className="w-full rounded-2xl border border-site bg-transparent px-4 py-3 text-sm text-highlight outline-none transition placeholder:text-normal focus:border-(--color-accent)"
              />

              <textarea
                placeholder="Message"
                rows={6}
                className="w-full resize-none rounded-2xl border border-site bg-transparent px-4 py-3 text-sm text-highlight outline-none transition placeholder:text-normal focus:border-(--color-accent)"
              />

              <Button type="button">
                Submit Coming Soon
                <Send className="ml-2" size={17} />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}
