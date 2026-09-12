"use client";

import { useState } from "react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@repo/ui/dialog";

interface MobileInfoSheetProps {
	title: string;
	trigger: React.ReactNode;
	children: React.ReactNode;
}

/**
 * The mobile Profile page's own bottom-sheet pattern — "Personal
 * Information" and (merchant) "Business Information" both open their
 * desktop-tab content this way instead of navigating to a separate page,
 * per the mock. No close button (`showCloseButton={false}`) — the mock's
 * own sheets have just the drag handle (`mobileSheet`'s own affordance)
 * plus each form's own Cancel button, not a floating X too.
 */
function MobileInfoSheet({ title, trigger, children }: MobileInfoSheetProps) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent mobileSheet showCloseButton={false} className="lg:hidden">
				<DialogHeader className="pr-0">
					<DialogTitle className="text-center">{title}</DialogTitle>
				</DialogHeader>
				{children}
			</DialogContent>
		</Dialog>
	);
}

export { MobileInfoSheet };
