import { PublicLayout } from "@/components/layout/public-layout";
import { getPortfolio } from "@/lib/public-api";

export default async function HomePage() {
  const portfolio = await getPortfolio();

  return (
    <PublicLayout>
      <section id="home" className="section-padding">
        <div className="container-custom">
          <p className="text-sm font-medium text-accent">
            Backend Developer Portfolio
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-highlight md:text-6xl">
            {portfolio?.hero?.name || "AL Shahariar Arafat Shawon"}
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-normal">
            {portfolio?.hero?.designation ||
              "Backend Developer | Backend-Focused Full-Stack Developer | Software Engineer"}
          </p>

          <p className="mt-6 max-w-3xl leading-8 text-normal">
            {portfolio?.hero?.introduction ||
              "I build secure, scalable, and database-driven web applications."}
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-site bg-card p-6">
              <h2 className="text-lg font-semibold text-highlight">
                Projects
              </h2>
              <p className="mt-2 text-3xl font-bold text-accent">
                {portfolio?.projects?.length || 0}
              </p>
            </div>

            <div className="rounded-2xl border border-site bg-card p-6">
              <h2 className="text-lg font-semibold text-highlight">Skills</h2>
              <p className="mt-2 text-3xl font-bold text-accent">
                {portfolio?.skills?.reduce(
                  (total, category) => total + category.skills.length,
                  0
                ) || 0}
              </p>
            </div>

            <div className="rounded-2xl border border-site bg-card p-6">
              <h2 className="text-lg font-semibold text-highlight">
                Services
              </h2>
              <p className="mt-2 text-3xl font-bold text-accent">
                {portfolio?.services?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}