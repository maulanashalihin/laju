/**
 * Inertia Service
 *
 * Minimal config — template handling (Vite, CSRF, favicon, flash)
 * udah dihandle langsung oleh hyper-express-inertia package.
 */

import { Inertia } from "hyper-express-inertia";
import { SessionStore } from "../session/store";
import type { Request } from "../../type";
import { readFileSync, existsSync } from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Asset version
// ---------------------------------------------------------------------------
let pkg: { version?: string } = { version: "1.0.0" };
try {
	pkg = JSON.parse(
		readFileSync(path.join(process.cwd(), "package.json"), "utf8"),
	);
} catch {}

// ---------------------------------------------------------------------------
// Vite helpers
// ---------------------------------------------------------------------------
function getViteDevUrl(): string {
	try {
		const portFile = path.join(process.cwd(), ".vite-port");
		if (existsSync(portFile)) {
			return readFileSync(portFile, "utf8").trim();
		}
	} catch {}
	return `http://localhost:${process.env.VITE_PORT || "5173"}`;
}

// ---------------------------------------------------------------------------
// Vite manifest (production)
// ---------------------------------------------------------------------------
let viteManifest: Record<string, { file: string; css?: string[] }> = {};
try {
	const manifestPath = path.join(process.cwd(), "dist/.vite/manifest.json");
	if (existsSync(manifestPath)) {
		viteManifest = JSON.parse(readFileSync(manifestPath, "utf8"));
	}
} catch {}

// ---------------------------------------------------------------------------
// Create Inertia adapter — single instance untuk seluruh app
// ---------------------------------------------------------------------------
export const inertia = new Inertia({
	version: pkg.version,

	// Template customization — package handles rendering
	title: "Laju",
	favicon: "/public/new-laju.png",
	csrf: true,
	devUrl: process.env.NODE_ENV !== "production" ? getViteDevUrl() : undefined,
	manifest: process.env.NODE_ENV === "production" ? viteManifest : undefined,
	script: "src/app.js",
	stylesheet: "src/index.css",
});

// ---------------------------------------------------------------------------
// Shared props (Laju-specific — needs SessionStore)
// ---------------------------------------------------------------------------
inertia.shareFunc("user", (req) => {
	const session = SessionStore.get(req as unknown as Request);
	if (!session.user_id) return null;
	return {
		id: session.user_id,
		name: session.name,
		email: session.email,
		avatar: session.avatar,
		is_admin: session.is_admin,
		is_verified: session.email_verified,
	};
});

inertia.shareFunc("flash", (req) => {
	const flashMessages = SessionStore.getFlash(req as unknown as Request);
	return Object.keys(flashMessages).length > 0 ? flashMessages : null;
});

inertia.share("appName", "Laju");
inertia.share("appVersion", pkg.version);

export default inertia;
