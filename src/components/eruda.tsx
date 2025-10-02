"use client";

import { useEffect } from "react";

export function ErudaContainer() {
	useEffect(() => {
		import("eruda").then((e) => e.default.init());
	}, []);

	return <div />;
}
