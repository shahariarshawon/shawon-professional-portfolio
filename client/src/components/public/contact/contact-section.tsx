"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, MapPin, Phone, Send, Smartphone } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  contactFormSchema,
  TContactFormValues,
} from "@/components/public/contact/contact-schema";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getErrorMessage } from "@/lib/get-error-message";
import { sendContactMessage } from "@/lib/contact-api";
import { TContactInfo, TSocialLink } from "@/types/portfolio";
import { useMutation } from "@tanstack/react-query";
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      website: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: sendContactMessage,
    onSuccess: () => {
      reset();
    },
  });

  const onSubmit = (values: TContactFormValues) => {
    contactMutation.mutate({
      name: values.name,
      email: values.email,
      subject: values.subject || undefined,
      message: values.message,
      website: values.website,
    });
  };

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
              Fill out the form below and your message will be saved securely in
              the admin dashboard.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                {...register("website")}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full rounded-2xl border border-site bg-transparent px-4 py-3 text-sm text-highlight outline-none transition placeholder:text-normal focus:border-(--color-accent)"
                    {...register("name")}
                  />
                  {errors.name ? (
                    <p className="mt-2 text-xs text-red-400">
                      {errors.name.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full rounded-2xl border border-site bg-transparent px-4 py-3 text-sm text-highlight outline-none transition placeholder:text-normal focus:border-(--color-accent)"
                    {...register("email")}
                  />
                  {errors.email ? (
                    <p className="mt-2 text-xs text-red-400">
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full rounded-2xl border border-site bg-transparent px-4 py-3 text-sm text-highlight outline-none transition placeholder:text-normal focus:border-(--color-accent)"
                  {...register("subject")}
                />
                {errors.subject ? (
                  <p className="mt-2 text-xs text-red-400">
                    {errors.subject.message}
                  </p>
                ) : null}
              </div>

              <div>
                <textarea
                  placeholder="Message"
                  rows={6}
                  className="w-full resize-none rounded-2xl border border-site bg-transparent px-4 py-3 text-sm text-highlight outline-none transition placeholder:text-normal focus:border-(--color-accent)"
                  {...register("message")}
                />
                {errors.message ? (
                  <p className="mt-2 text-xs text-red-400">
                    {errors.message.message}
                  </p>
                ) : null}
              </div>

              {contactMutation.isSuccess ? (
                <div className="rounded-2xl border border-(--color-accent)/30 bg-(--color-accent)/10 p-4 text-sm text-accent">
                  Message sent successfully. I will get back to you soon.
                </div>
              ) : null}

              {contactMutation.error ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                  {getErrorMessage(contactMutation.error)}
                </div>
              ) : null}

              <Button type="submit" disabled={contactMutation.isPending}>
                {contactMutation.isPending ? (
                  <Loader2 className="mr-2 animate-spin" size={17} />
                ) : (
                  <Send className="mr-2" size={17} />
                )}
                {contactMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}
