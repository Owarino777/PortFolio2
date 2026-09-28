export interface ApiProject {
	slug: string;
	title: string;
	description: string;
	publishDate: string;
	tags: string[];
	imagePath: string;
	imageAlt: string;
	pagePath: string;
	demoUrl?: string;
}

export interface ApiProfile {
	name: string;
	role: string;
	location: string;
	technologies: string[];
}

export interface ContactInput {
	name: string;
	email: string;
	message: string;
	website?: string;
}

export function getApiBaseUrl(): string | null {
	const configured = import.meta.env.PUBLIC_API_BASE_URL?.trim();
	if (!configured) return null;
	try {
		const url = new URL(configured);
		return ["http:", "https:"].includes(url.protocol) ? url.origin : null;
	} catch {
		return null;
	}
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
	const base = getApiBaseUrl();
	if (!base) throw new Error("Portfolio API is not configured");
	const response = await fetch(`${base}${path}`, { ...init, signal: AbortSignal.timeout(8000) });
	if (!response.ok) throw new Error(`Portfolio API returned ${response.status}`);
	return response.json() as Promise<T>;
}

export async function getProjects(): Promise<ApiProject[]> {
	const result = await requestJson<{ projects: ApiProject[] }>("/api/projects");
	if (!Array.isArray(result.projects)) throw new Error("Invalid projects response");
	return result.projects;
}

export async function getProject(slug: string): Promise<ApiProject> {
	const result = await requestJson<{ project: ApiProject }>(`/api/projects/${encodeURIComponent(slug)}`);
	if (!result.project || result.project.slug !== slug) throw new Error("Invalid project response");
	return result.project;
}

export async function getProfile(): Promise<ApiProfile> {
	const result = await requestJson<{ profile: ApiProfile }>("/api/profile");
	if (!result.profile || !Array.isArray(result.profile.technologies)) throw new Error("Invalid profile response");
	return result.profile;
}

export async function sendContact(message: ContactInput): Promise<void> {
	const result = await requestJson<{ status: string }>("/api/contact", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(message),
	});
	if (result.status !== "accepted") throw new Error("Contact was not accepted");
}
