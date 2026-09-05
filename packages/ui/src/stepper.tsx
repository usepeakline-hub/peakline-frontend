import { cn } from "./lib/utils";

interface StepperProps {
	steps: string[];
	/** 1-indexed — matches how the steps are labelled ("1", "2", "3"). */
	currentStep: number;
	className?: string;
}

/**
 * Horizontal progress stepper — the "Step Symbol" component set from the
 * Personal Details sheet (numbered circles joined by trail lines). Only the
 * current step's label is shown so it stays legible in the narrow auth-form
 * column; the others are just numbered.
 */
function Stepper({ steps, currentStep, className }: StepperProps) {
	return (
		<ol className={cn("flex items-center", className)}>
			{steps.map((label, index) => {
				const step = index + 1;
				const reached = step <= currentStep;
				return (
					<li
						key={label}
						className={cn(
							"flex items-center",
							step < steps.length && "flex-1",
						)}
					>
						<span
							className={cn(
								"flex size-8 shrink-0 items-center justify-center rounded-full text-c2 text-foreground",
								reached
									? "bg-primary-500 text-primary-foreground"
									: "border border-neutral-200 text-neutral-300",
							)}
						>
							{step}
						</span>
						{step === currentStep && (
							<span className="ml-2 whitespace-nowrap text-b4 text-primary-500">
								{label}
							</span>
						)}
						{step < steps.length && (
							<span
								aria-hidden="true"
								className={cn(
									"mx-2 h-px flex-1",
									step < currentStep ? "bg-primary-500" : "bg-border",
								)}
							/>
						)}
					</li>
				);
			})}
		</ol>
	);
}

export { Stepper };
export type { StepperProps };
