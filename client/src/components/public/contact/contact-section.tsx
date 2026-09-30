"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  type LucideIcon
} from "lucide-react";
import { useForm } from "react-hook-form";
import { FaWhatsapp } from "react-icons/fa6";

import {
  contactFormSchema,
  TContactFormValues
} from "@/components/public/contact/contact-schema";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { Section } from "@/components/ui/section";
import { SocialLink } from "@/components/ui/social-link";
import { getErrorMessage } from "@/lib/get-error-message";
import { sendContactMessage } from "@/lib/contact-api";
import { cn } from "@/lib/utils";
import { TContactInfo, TSocialLink } from "@/types/portfolio";

type TContactSectionProps = {
  contactInfo: TContactInfo | null;
  socialLinks: TSocialLink[];
};

const inputClass =
  "peer w-full rounded-2xl border border-line bg-glass px-4 py-3.5 text-sm text-fg outline-none transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-muted/60 hover:border-line-strong focus:border-[var(--color-accent-bright)]/60 focus:bg-glass-strong focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-accent-bright)_12%,transparent)] aria-[invalid=true]:border-red-400/60";

export function ContactSection({ contactInfo, socialLinks }: TContactSectionProps) {
  const email = contactInfo?.email || "shahariarshawon.dev@gmail.com";
  const phone = contactInfo?.phone || "+880-1518-935876";
  const whatsapp = contactInfo?.whatsapp || "+880-1518-935876";
  const location = contactInfo?.location || "Uttara, Dhaka, Bangladesh";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      website: ""
    }
  });

  const contactMutation = useMutation({
    mutationFn: sendContactMessage,
    onSuccess: () => {
      reset();
    }
  });

  const onSubmit = (values: TContactFormValues) => {
    contactMutation.mutate({
      name: values.name,
      email: values.email,
      subject: values.subject || undefined,
      message: values.message,
      website: values.website
    });
  };

  const channels: { icon: LucideIcon | typeof FaWhatsapp; label: string; value: string; href?: string; external?: boolean }[] = [
    { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
    { icon: Phone, label: "Phone", value: phone, href: `tel:${phone.replace(/[^+\d]/g, "")}` },
    {
      icon: FaWhatsapp,
      label: "WhatsApp",
      value: whatsapp,
      href: `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`,
      external: true
    },
    { icon: MapPin, label: "Location", value: location }
  ];

  return (
    <Section id="contact" className="overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[40rem] w-[60rem] max-w-[140vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_top,var(--glow-2),transparent_65%)]"
      />

      <SectionHeading
        index="07"
        eyebrow="Contact"
        title="Let's build something"
        highlight="great together."
        description="Backend work, full-stack builds, a quick consultation or a full-time role — my inbox is open."
      />

      <div className="mt-14 grid gap-6 lg:mt-16 lg:grid-cols-12 lg:gap-8">
        {/* Channels */}
        <Reveal className="lg:col-span-5">
          <Card variant="glass" className="overflow-hidden p-2">
            <ul className="divide-y divide-(--color-border)">
              {channels.map(({ icon: Icon, label, value, href, external }) => {
                const content = (
                  <>
                    <IconTile size="sm">
                      <Icon size={17} />
                    </IconTile>
                    <div className="min-w-0 flex-1">
                      <p className="text-eyebrow text-muted">{label}</p>
                      <p className="mt-1.5 truncate text-sm font-medium text-fg">{value}</p>
                    </div>
                    {href ? (
                      <ArrowUpRight
                        size={17}
                        className="shrink-0 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-bright"
                      />
                    ) : null}
                  </>
                );

                return (
                  <li key={label}>
                    {href ? (
                      <a
                        href={href}
                        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                        className="group flex items-center gap-4 rounded-2xl px-4 py-4 transition-colors hover:bg-glass"
                      >
                        {content}
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 px-4 py-4">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Card>

          {socialLinks.length ? (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-eyebrow mr-2 text-muted">Elsewhere</span>
              {socialLinks.map((link) => (
                <SocialLink key={link.id} platform={link.platform} href={link.url} target="_blank" rel="noreferrer" />
              ))}
            </div>
          ) : null}
        </Reveal>

        {/* Form */}
        <Reveal delay={0.08} className="lg:col-span-7">
          <Card variant="gradient" className="p-6 sm:p-10">
            <h3 className="text-h3 text-fg">Send a message</h3>
            <p className="mt-2 text-sm leading-7 text-muted">
              Share a few details about what you&apos;re working on and I&apos;ll get back to you.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
              {/* Honeypot — hidden from people, tempting for bots. */}
              <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" {...register("website")} />

              <div className="grid gap-5 md:grid-cols-2">
                <Field id="contact-name" label="Name" error={errors.name?.message}>
                  <input
                    id="contact-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Doe"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                    className={inputClass}
                    {...register("name")}
                  />
                </Field>

                <Field id="contact-email" label="Email" error={errors.email?.message}>
                  <input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    placeholder="jane@company.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                    className={inputClass}
                    {...register("email")}
                  />
                </Field>
              </div>

              <Field id="contact-subject" label="Subject" optional error={errors.subject?.message}>
                <input
                  id="contact-subject"
                  type="text"
                  placeholder="Backend role, freelance project, collaboration…"
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={errors.subject ? "contact-subject-error" : undefined}
                  className={inputClass}
                  {...register("subject")}
                />
              </Field>

              <Field id="contact-message" label="Message" error={errors.message?.message}>
                <textarea
                  id="contact-message"
                  rows={6}
                  placeholder="Tell me about the project, timeline and what success looks like."
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "contact-message-error" : undefined}
                  className={cn(inputClass, "resize-none")}
                  {...register("message")}
                />
              </Field>

              <AnimatePresence initial={false}>
                {contactMutation.isSuccess ? (
                  <motion.div
                    key="success"
                    role="status"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 p-4 text-sm text-fg">
                      <CheckCircle2 size={18} className="shrink-0 text-brand" />
                      Message sent. I&apos;ll get back to you soon.
                    </div>
                  </motion.div>
                ) : null}

                {contactMutation.error ? (
                  <motion.div
                    key="error"
                    role="alert"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500 dark:text-red-300">
                      {getErrorMessage(contactMutation.error)}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <Button
                type="submit"
                variant="brand"
                size="lg"
                disabled={contactMutation.isPending}
                className="group w-full sm:w-auto"
              >
                {contactMutation.isPending ? (
                  <Loader2 className="animate-spin" size={17} />
                ) : (
                  <Send size={17} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                )}
                {contactMutation.isPending ? "Sending…" : "Send message"}
              </Button>
            </form>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}

type TFieldProps = {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
};

function Field({ id, label, optional, error, children }: TFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-center justify-between text-xs font-medium text-fg">
        {label}
        {optional ? <span className="font-mono text-[10px] uppercase tracking-wider text-muted">Optional</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-xs text-red-500 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
