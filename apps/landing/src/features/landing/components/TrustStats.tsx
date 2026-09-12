import type { LucideIcon } from "lucide-react";
import { Star, MapPin } from "lucide-react";

interface Stat {
	value: string;
	description: string;
	icon?: LucideIcon;
}

const STATS: Stat[] = [
	{
		value: "120K+",
		description:
			"Our platform is a trusted choice for money transfers for both individuals & merchants.",
	},
	{
		value: "4.9",
		description:
			"Our high rating proves our platform's quality and positive global user impact.",
		icon: Star,
	},
	{
		value: "89+",
		description:
			"Our global presence ensures reliable, efficient financial solutions.",
		icon: MapPin,
	},
];

/** Figma "Credit" (#418:8811). The 120K+ stat's avatar trio stands in for
 * the real user photos (Figma exports unavailable — see build plan). */
function TrustStats() {
	return (
		<section className="custom-container grid grid-cols-1 gap-10 sm:grid-cols-3">
			{STATS.map((stat) => (
				<div key={stat.value} className="flex flex-col gap-5">
					<div className="flex items-center gap-3">
						{stat.icon ? (
							<stat.icon className="size-8 text-primary-500" aria-hidden="true" />
						) : (
							<span className="flex -space-x-2">
								{["bg-[#FF9F9F]", "bg-[#A0FC98]", "bg-secondary-600"].map(
									(color, i) => (
										<span
											key={i}
											className={`size-10 rounded-full border-2 border-background ${color}`}
										/>
									),
								)}
							</span>
						)}
						<span className="text-h3 text-foreground">{stat.value}</span>
					</div>
					<p className="max-w-[306px] text-b3 text-neutral-500">{stat.description}</p>
				</div>
			))}
		</section>
	);
}

export { TrustStats };
