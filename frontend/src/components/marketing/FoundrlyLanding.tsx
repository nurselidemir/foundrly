import { useState } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const trustStats = [
  { value: "12K+", label: "founders, builders and designers on waitlist" },
  { value: "420+", label: "hackathon and startup teams formed" },
  { value: "91%", label: "reported stronger team fit after matching" },
  { value: "$0", label: "spent on noisy founder group chats" },
];

const trustProfiles = [
  { name: "Aylin", role: "Founder, Climate SaaS", badge: "Series-ready" },
  { name: "Bora", role: "iOS Engineer, Hackathons", badge: "Verified talent" },
  { name: "Duru", role: "Product Designer, AI tools", badge: "Top collaborator" },
  { name: "Mert", role: "Full-stack Builder", badge: "Team captain" },
];

const featureCards = [
  {
    title: "AI Team Matching",
    body: "Skills, goals, collaboration patterns and personality signals align into one matching score.",
  },
  {
    title: "Verified Talent Badge",
    body: "Surface trustworthy builders and signal quality immediately to founders and teams.",
  },
  {
    title: "Project Discovery",
    body: "Find startup concepts, hackathon projects and university initiatives ready for momentum.",
  },
  {
    title: "Collaboration Feedback",
    body: "Structured post-project reviews create a reputation layer for future team decisions.",
  },
  {
    title: "Mentor Connections",
    body: "Premium founders unlock curated access to operators, mentors and product experts.",
  },
  {
    title: "Premium Visibility",
    body: "Get highlighted placement across discovery, applications and curated recommendation flows.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create your founder profile",
    body: "Add your skills, startup goals, availability and the kind of builder energy you want around you.",
  },
  {
    step: "02",
    title: "Launch your project signal",
    body: "Share the mission, open roles and the kind of chemistry your team needs to move fast.",
  },
  {
    step: "03",
    title: "Build with the right people",
    body: "Use AI-ranked matches, feedback signals and verified profiles to form a serious team quickly.",
  },
];

const testimonials = [
  {
    quote:
      "Foundrly helped us replace weeks of messy founder networking with one sharp team formation workflow.",
    name: "Selin Kaya",
    title: "Founder, NeuroLens",
  },
  {
    quote:
      "The matching felt unusually precise. It wasn’t just stack fit, it was motivation and pace fit too.",
    name: "Arda Demir",
    title: "Hackathon Lead, BuildNight",
  },
  {
    quote:
      "This feels like what LinkedIn would look like if it were designed for real startup execution instead of resumes.",
    name: "Lina Voss",
    title: "Product Designer, studio founder",
  },
];

const pricing = [
  {
    name: "Free",
    price: "$0",
    note: "for exploring the network",
    items: [
      "Founder profile",
      "Project discovery",
      "Basic applications",
      "Community access",
    ],
  },
  {
    name: "Premium",
    price: "$5",
    note: "per month · $48 yearly",
    items: [
      "AI team matching",
      "Verified talent workflow",
      "Premium visibility boost",
      "Advanced filters and mentor access",
    ],
  },
];

const appShots = [
  "AI-ranked builder suggestions",
  "Swipe through high-fit candidates",
  "Approve, message and build instantly",
];

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/45">{eyebrow}</p>
      <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl">{title}</h2>
      <p className="mt-5 text-lg leading-8 text-slate-300">{body}</p>
    </div>
  );
}

export default function FoundrlyLanding({
  onSearchUser,
}: {
  onSearchUser?: (query: string) => void;
}) {
  const [query, setQuery] = useState("");

  return (
    <div className="bg-[#050B18] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(71,93,178,0.35),transparent_26%),radial-gradient(circle_at_80%_18%,rgba(63,177,112,0.18),transparent_20%),radial-gradient(circle_at_50%_110%,rgba(71,93,178,0.22),transparent_38%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/6 to-transparent" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-16 md:pt-24 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:pb-28">
          <div className="space-y-8">
            <motion.div custom={0} initial="hidden" animate="show" variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/72 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_18px_rgba(63,177,112,0.8)]" />
                AI-powered founder network
              </span>
            </motion.div>

            <motion.div className="space-y-6" custom={0.08} initial="hidden" animate="show" variants={fadeUp}>
              <h1 className="max-w-5xl text-6xl font-black leading-[0.92] tracking-[-0.05em] md:text-7xl lg:text-[6.2rem]">
                Turn ideas
                <span className="block bg-[linear-gradient(135deg,#ffffff_0%,#9ab0ff_55%,#56d08c_100%)] bg-clip-text text-transparent">
                  into teams.
                </span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                Foundrly is the AI platform for founders, developers, designers and startup operators who need
                exceptional teammates for products, hackathons and early-stage ventures.
              </p>
            </motion.div>

            <motion.div
              className="flex max-w-2xl flex-col gap-4 rounded-[28px] border border-white/10 bg-white/6 p-4 backdrop-blur-xl md:flex-row"
              custom={0.16}
              initial="hidden"
              animate="show"
              variants={fadeUp}
            >
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search AI engineers, product designers, growth builders..."
                className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white outline-none placeholder:text-white/32 focus:border-white/25"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!query.trim()) return;
                    window.location.hash = `#discover?search=${encodeURIComponent(query.trim())}`;
                    onSearchUser?.(query.trim());
                  }}
                  className="rounded-2xl bg-[linear-gradient(135deg,#5b73db_0%,#475DB2_45%,#3FB170_100%)] px-6 py-4 text-sm font-bold text-white shadow-[0_16px_45px_rgba(71,93,178,0.42)] transition hover:scale-[1.02]"
                >
                  Find matches
                </button>
                <a
                  href="#premium"
                  className="rounded-2xl border border-white/12 bg-white/7 px-6 py-4 text-sm font-semibold text-white/88 transition hover:border-white/22 hover:bg-white/10"
                >
                  Explore Premium
                </a>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-3 text-sm text-white/68"
              custom={0.24}
              initial="hidden"
              animate="show"
              variants={fadeUp}
            >
              {["Hackathon teams", "Startup co-founders", "University builders", "Verified talent"].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
                  {item}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="relative"
            custom={0.12}
            initial="hidden"
            animate="show"
            variants={fadeUp}
          >
            <div className="absolute -left-6 top-16 h-28 w-28 rounded-full bg-primary/30 blur-3xl" />
            <div className="absolute bottom-20 right-0 h-28 w-28 rounded-full bg-success/20 blur-3xl" />

            <div className="relative rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,19,38,0.98),rgba(11,17,33,0.92))] p-5 shadow-[0_36px_120px_rgba(0,0,0,0.45)]">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="flex items-center justify-between border-b border-white/8 pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/42">Foundrly OS</p>
                    <p className="mt-2 text-xl font-bold text-white">Team Builder Dashboard</p>
                  </div>
                  <div className="rounded-full border border-success/20 bg-success/12 px-4 py-2 text-xs font-semibold text-success">
                    Matching live
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
                  <div className="space-y-4">
                    <div className="rounded-[22px] border border-white/8 bg-black/22 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.28em] text-white/38">Project signal</p>
                          <h3 className="mt-2 text-lg font-bold">AI campus startup builder team</h3>
                        </div>
                        <span className="rounded-full bg-primary/16 px-3 py-1 text-xs font-semibold text-[#9bb2ff]">
                          4 open roles
                        </span>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {[
                          ["Skills fit", "96%"],
                          ["Goal alignment", "89%"],
                          ["Collab history", "81%"],
                          ["Personality sync", "92%"],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.22em] text-white/34">{label}</p>
                            <p className="mt-2 text-2xl font-black text-white">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-white/8 bg-[linear-gradient(135deg,rgba(71,93,178,0.22),rgba(63,177,112,0.12))] p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white/82">Recommended core team</p>
                        <p className="text-xs uppercase tracking-[0.24em] text-white/42">Top matches</p>
                      </div>
                      <div className="mt-4 space-y-3">
                        {[
                          ["Backend + AI", "92%", "#3FB170"],
                          ["Product Design", "89%", "#89a1ff"],
                          ["Growth + GTM", "84%", "#D7B56D"],
                        ].map(([label, score, color]) => (
                          <div key={label} className="rounded-2xl border border-white/8 bg-black/18 p-3">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-white/88">{label}</p>
                              <p className="text-sm font-bold text-white">{score}</p>
                            </div>
                            <div className="mt-3 h-2 rounded-full bg-white/8">
                              <div className="h-2 rounded-full" style={{ width: score, backgroundColor: color }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        title: "Verified iOS Builder",
                        meta: "SwiftUI • AI tools • mentor-ready",
                        badge: "High compatibility",
                      },
                      {
                        title: "Product Designer",
                        meta: "B2B SaaS • prototyping • feedback loops",
                        badge: "Top collaborator",
                      },
                      {
                        title: "Growth Engineer",
                        meta: "Launch ops • analytics • campus growth",
                        badge: "Fast execution",
                      },
                    ].map((card, index) => (
                      <motion.div
                        key={card.title}
                        className="rounded-[22px] border border-white/10 bg-white/7 p-4 backdrop-blur"
                        animate={{ y: [0, index % 2 === 0 ? -8 : 8, 0] }}
                        transition={{ repeat: Infinity, duration: 5 + index, ease: "easeInOut" }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(71,93,178,0.5),rgba(63,177,112,0.3))] text-sm font-bold">
                              {card.title
                                .split(" ")
                                .map((word) => word[0])
                                .join("")
                                .slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{card.title}</p>
                              <p className="mt-1 text-xs text-white/44">{card.meta}</p>
                            </div>
                          </div>
                          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">
                            {card.badge}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <motion.div
                className="absolute -left-8 bottom-10 rounded-[22px] border border-white/10 bg-white/8 px-5 py-4 backdrop-blur"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 5.4, ease: "easeInOut" }}
              >
                <p className="text-xs uppercase tracking-[0.24em] text-white/46">Collab signal</p>
                <p className="mt-2 text-2xl font-black">4.9/5</p>
                <p className="mt-1 text-sm text-white/62">feedback-based founder rating</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[linear-gradient(180deg,#060D1B_0%,#081225_100%)]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <SectionHeading
            eyebrow="Trusted community"
            title="Built for serious startup people, not random group chats."
            body="From founder circles to hackathon teams and university builders, Foundrly creates a sharper community graph with investor-ready energy."
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="grid gap-4 md:grid-cols-2">
              {trustProfiles.map((profile, index) => (
                <motion.article
                  key={profile.name}
                  className="rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  custom={index * 0.06}
                  variants={fadeUp}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#475DB2,#3FB170)] text-base font-black">
                      {profile.name[0]}
                    </div>
                    <div>
                      <p className="text-lg font-bold">{profile.name}</p>
                      <p className="mt-1 text-sm text-white/52">{profile.role}</p>
                    </div>
                  </div>
                  <div className="mt-6 rounded-2xl border border-white/10 bg-black/16 px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#9ab0ff]">
                    {profile.badge}
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="grid gap-4">
              {trustStats.map((item, index) => (
                <motion.div
                  key={item.label}
                  className="rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  custom={index * 0.05}
                  variants={fadeUp}
                >
                  <p className="text-4xl font-black tracking-tight text-white">{item.value}</p>
                  <p className="mt-2 max-w-sm text-sm leading-7 text-slate-300">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <SectionHeading
            eyebrow="AI Team Builder"
            title="Matching that sees more than a tech stack."
            body="Foundrly analyzes technical skills, interests, collaboration history, project goals and personality compatibility to assemble teams with higher execution potential."
          />

          <div className="grid gap-4">
            <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 backdrop-blur">
              <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-[24px] border border-white/10 bg-black/18 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/42">Input graph</p>
                  <div className="mt-5 space-y-4">
                    {["Technical skills", "Interests", "Collaboration history", "Project goals", "Personality fit"].map((item) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-black/18 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/42">Decision engine</p>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {[
                      ["Semantic fit", "TF-IDF + weighted scoring"],
                      ["Trust score", "Verified + feedback intelligence"],
                      ["Execution speed", "Availability + role urgency"],
                      ["Team chemistry", "Compatibility signal"],
                    ].map(([title, body]) => (
                      <div key={title} className="rounded-2xl border border-white/10 bg-white/6 p-4">
                        <p className="font-semibold text-white">{title}</p>
                        <p className="mt-2 text-sm leading-7 text-slate-300">{body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                "Team graph visualizations",
                "Project-role compatibility heatmaps",
                "Network-style recommendation cards",
              ].map((item) => (
                <div key={item} className="rounded-[24px] border border-white/10 bg-white/6 p-5 text-sm leading-7 text-slate-300 backdrop-blur">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <SectionHeading
            eyebrow="Features"
            title="Every startup team signal in one premium workspace."
            body="Foundrly combines community, trust, matching and visibility into a world-class startup formation product."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((card, index) => (
              <motion.article
                key={card.title}
                className="rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                custom={index * 0.04}
                variants={fadeUp}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(71,93,178,0.5),rgba(63,177,112,0.28))] text-sm font-black">
                  0{index + 1}
                </div>
                <h3 className="mt-6 text-2xl font-bold">{card.title}</h3>
                <p className="mt-4 text-base leading-8 text-slate-300">{card.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[linear-gradient(180deg,#050B18_0%,#091328_100%)]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <SectionHeading
            eyebrow="How it works"
            title="A beautiful startup onboarding flow in three powerful moves."
            body="Designed to feel fast, investor-ready and strangely addictive from the very first step."
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {steps.map((step, index) => (
              <motion.article
                key={step.step}
                className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/6 p-6 backdrop-blur"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                custom={index * 0.06}
                variants={fadeUp}
              >
                <div className="absolute -right-8 top-6 text-7xl font-black text-white/6">{step.step}</div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9ab0ff]">Step {step.step}</p>
                <h3 className="mt-5 text-2xl font-bold">{step.title}</h3>
                <p className="mt-4 text-base leading-8 text-slate-300">{step.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <SectionHeading
            eyebrow="Premium pricing"
            title="A modern SaaS pricing model for serious builders."
            body="Start free. Upgrade when you're ready for verified trust, AI matching and premium visibility."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {pricing.map((plan, index) => (
              <motion.article
                key={plan.name}
                className={`rounded-[34px] border p-8 backdrop-blur ${
                  plan.name === "Premium"
                    ? "border-primary/40 bg-[linear-gradient(135deg,rgba(71,93,178,0.22),rgba(27,45,73,0.9))] shadow-[0_30px_80px_rgba(71,93,178,0.25)]"
                    : "border-white/10 bg-white/6"
                }`}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                custom={index * 0.08}
                variants={fadeUp}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/45">{plan.name}</p>
                    <p className="mt-4 text-5xl font-black tracking-tight">{plan.price}</p>
                    <p className="mt-3 text-sm text-slate-300">{plan.note}</p>
                  </div>
                  {plan.name === "Premium" && (
                    <span className="rounded-full border border-success/24 bg-success/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-success">
                      Most loved
                    </span>
                  )}
                </div>

                <div className="mt-8 space-y-3">
                  {plan.items.map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-black/16 px-4 py-4 text-sm text-white/84">
                      {item}
                    </div>
                  ))}
                </div>

                <a
                  href={plan.name === "Premium" ? "#premium" : "#register"}
                  className={`mt-8 inline-flex rounded-2xl px-6 py-4 text-sm font-bold transition hover:scale-[1.02] ${
                    plan.name === "Premium"
                      ? "bg-[linear-gradient(135deg,#5b73db_0%,#475DB2_45%,#3FB170_100%)] text-white shadow-[0_16px_45px_rgba(71,93,178,0.42)]"
                      : "border border-white/10 bg-white/8 text-white"
                  }`}
                >
                  {plan.name === "Premium" ? "Unlock Premium" : "Start Free"}
                </a>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[linear-gradient(180deg,#07111f_0%,#050B18_100%)]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <SectionHeading
            eyebrow="Testimonials"
            title="What founders say after building inside Foundrly."
            body="Investor-ready teams start with better people signals. These stories reflect that difference."
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <motion.article
                key={item.name}
                className="rounded-[30px] border border-white/10 bg-white/6 p-6 backdrop-blur"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                custom={index * 0.05}
                variants={fadeUp}
              >
                <p className="text-lg leading-8 text-white/84">“{item.quote}”</p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#475DB2,#3FB170)] font-bold">
                    {item.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="mt-1 text-sm text-white/46">{item.title}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <SectionHeading
            eyebrow="Mobile app showcase"
            title="A startup-native mobile experience with App Store polish."
            body="From match discovery to founder messaging, Foundrly on iPhone feels like a product built by teams who obsess over detail."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {appShots.map((title, index) => (
              <motion.div
                key={title}
                className="relative mx-auto w-full max-w-[220px]"
                animate={{ y: [0, index % 2 === 0 ? -10 : 10, 0] }}
                transition={{ repeat: Infinity, duration: 6 + index, ease: "easeInOut" }}
              >
                <div className="rounded-[42px] border border-white/10 bg-[linear-gradient(180deg,#111C35,#091224)] p-3 shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
                  <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4">
                    <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-white/18" />
                    <div className="rounded-[28px] bg-[radial-gradient(circle_at_top,rgba(71,93,178,0.35),transparent_40%),linear-gradient(180deg,#0c1730_0%,#111f41_100%)] p-4">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-white/44">Foundrly app</p>
                      <h3 className="mt-3 text-lg font-bold text-white">{title}</h3>
                      <div className="mt-5 space-y-3">
                        <div className="rounded-2xl border border-white/10 bg-white/8 px-3 py-3 text-xs text-white/70">
                          Team fit: 94%
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/8 px-3 py-3 text-xs text-white/70">
                          Founder verified
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/8 px-3 py-3 text-xs text-white/70">
                          Build now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(71,93,178,0.25),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(63,177,112,0.16),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center lg:px-10">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fadeUp}>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/45">Final CTA</p>
            <h2 className="mx-auto mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.04em] md:text-6xl">
              Build your dream team today.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Join the next generation of founders and builders who refuse to leave team formation to luck.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#register"
                className="rounded-2xl bg-[linear-gradient(135deg,#5b73db_0%,#475DB2_45%,#3FB170_100%)] px-7 py-4 text-sm font-bold text-white shadow-[0_16px_45px_rgba(71,93,178,0.42)] transition hover:scale-[1.03]"
              >
                Join Foundrly
              </a>
              <a
                href="#premium"
                className="rounded-2xl border border-white/12 bg-white/6 px-7 py-4 text-sm font-semibold text-white/88 backdrop-blur transition hover:bg-white/9"
              >
                See Premium
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
