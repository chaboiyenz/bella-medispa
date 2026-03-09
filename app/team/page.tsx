import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getTeamMembers } from "@/lib/actions/team";
import { TeamAdminBar } from "@/components/team/TeamAdminBar";
import { TeamCardAdmin } from "@/components/team/TeamCardAdmin";
import type { TeamMember } from "@/types";

export const metadata: Metadata = {
  title: "Meet Our Team | Bella MediSpa Dover, DE",
  description:
    "Meet the board-certified aesthetic practitioners at Bella MediSpa in Dover, DE — expert injectors, laser specialists, and clinical aestheticians committed to natural-looking results.",
  openGraph: {
    title: "Meet Our Team | Bella MediSpa",
    description:
      "Board-certified practitioners united by a shared commitment to clinical excellence and naturally beautiful results.",
  },
};

// ─── Team Card ────────────────────────────────────────────────────────────────
// Server Component with a thin client overlay (TeamCardAdmin) for admin controls.

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    // Named group so admin hover overlay doesn't conflict with card group effects
    <div className="relative group/admin">
      <article
        className="
          group relative flex flex-col rounded-3xl overflow-hidden
          bg-white shadow-md border border-slate-100
          hover:-translate-y-3 transition-transform duration-500
          animate-in fade-in-0 slide-in-from-bottom-8 fill-mode-both
        "
        style={{
          animationDelay:    `${index * 120}ms`,
          animationDuration: "700ms",
        }}
      >
        {/* Portrait */}
        <div className="relative aspect-3/4 overflow-hidden bg-slate-50">
          <span aria-hidden className="absolute inset-0 bg-[#17a2b8]/10 blur-3xl scale-125" />

          {member.image_url ? (
            <Image
              src={member.image_url}
              alt={`${member.name}, ${member.role} at Bella MediSpa Dover`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={index < 3}
              className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#CBD5E1]">
              <span className="font-serif text-5xl font-light">
                {member.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Gradient fade into card body */}
          <span aria-hidden className="absolute bottom-0 left-0 right-0 h-28 bg-linear-to-t from-white/70 to-transparent pointer-events-none" />
        </div>

        {/* Credentials */}
        <div className="flex flex-col gap-4 p-6 pt-5 flex-1">

          {/* Name + credential badge */}
          <header className="flex flex-col gap-0.5">
            <h2 className="font-serif text-xl font-semibold text-[#0F172A] leading-tight">
              {member.name}
              {member.credentials && (
                <span className="
                  ml-2 align-middle inline-flex items-center
                  px-2 py-0.5 rounded-full
                  bg-[#17a2b8]/10 text-[#17a2b8]
                  text-[10px] font-bold tracking-widest uppercase
                  border border-[#17a2b8]/25
                ">
                  {member.credentials}
                </span>
              )}
            </h2>
            <p className="text-sm font-medium text-[#64748B]">{member.role}</p>
            {member.license_no && (
              <p className="font-mono text-[11px] text-[#17a2b8]/70 tracking-wide">
                {member.license_no}
              </p>
            )}
          </header>

          {/* Bio */}
          {member.bio && (
            <p className="text-sm text-[#64748B] leading-relaxed line-clamp-3">
              {member.bio}
            </p>
          )}

          {/* Specializations */}
          {member.specializations.length > 0 && (
            <ul
              className="flex flex-col gap-1.5"
              aria-label={`${member.name}'s core specializations`}
            >
              {member.specializations.slice(0, 3).map((spec) => (
                <li key={spec} className="flex items-start gap-2.5 text-sm text-[#0F172A]">
                  <span aria-hidden className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#17a2b8] shrink-0" />
                  {spec}
                </li>
              ))}
            </ul>
          )}

          {/* Book CTA */}
          <div className="mt-auto pt-3">
            <Link
              href={`/book?provider=${member.id}`}
              className="
                block w-full text-center
                py-2.5 px-4 rounded-xl
                bg-[#ef3825] hover:bg-[#17a2b8]
                text-white text-sm font-semibold
                transition-colors duration-300
                shadow-sm shadow-[#ef3825]/30 hover:shadow-[#17a2b8]/30
              "
            >
              Schedule with {member.name.split(" ")[0]}
            </Link>
          </div>

        </div>
      </article>

      {/* Admin overlay — client component, renders nothing for non-admins */}
      <TeamCardAdmin member={member} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function TeamPage() {
  const { members, error } = await getTeamMembers();

  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="pt-28 pb-14 px-6 bg-white">
        <div className="max-w-5xl mx-auto">

          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-xs text-[#64748B] mb-8 shadow-sm"
          >
            <Link href="/" className="hover:text-[#17a2b8] transition-colors">Home</Link>
            <span aria-hidden className="text-slate-300">/</span>
            <span className="text-[#0F172A] font-medium">Our Team</span>
          </nav>

          <h1 className="font-serif text-5xl md:text-6xl font-bold text-[#0F172A] leading-tight tracking-tight">
            Meet our<br />
            <span className="text-[#ef3825]">Experts.</span>
          </h1>

          <p className="mt-5 text-lg text-[#64748B] max-w-xl leading-relaxed">
            Board-certified practitioners united by a shared commitment to clinical
            excellence and naturally beautiful results.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 max-w-xs bg-linear-to-r from-[#17a2b8]/40 to-transparent" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#17a2b8]">
              Dover, DE
            </span>
            <div className="h-px w-12 bg-[#17a2b8]/20" />
          </div>

        </div>
      </section>

      {/* Provider Grid */}
      <section className="pb-32 px-6" aria-label="Provider profiles">
        <div className="max-w-6xl mx-auto">

          {/* Admin bar — client component, invisible to non-admins */}
          <TeamAdminBar />

          {error && (
            <div className="text-center py-20">
              <div className="inline-flex flex-col items-center gap-3 rounded-3xl border border-red-100 bg-red-50 p-12">
                <p className="text-sm font-medium text-red-700">Unable to load team.</p>
                {process.env.NODE_ENV !== "production" && (
                  <p className="font-mono text-xs text-red-500 max-w-md break-all">{error}</p>
                )}
              </div>
            </div>
          )}

          {!error && members.length === 0 && (
            <div className="text-center py-24">
              <div className="inline-flex flex-col items-center gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-12">
                <p className="text-[#64748B] text-sm">
                  No team members yet — add specialists via the admin bar.
                </p>
              </div>
            </div>
          )}

          {!error && members.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((member, index) => (
                <TeamCard key={member.id} member={member} index={index} />
              ))}
            </div>
          )}

        </div>
      </section>

    </main>
  );
}
