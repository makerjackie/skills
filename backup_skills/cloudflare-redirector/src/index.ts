import compiledRules from "../data/redirects.compiled.json";

type RedirectRule = {
	source: string;
	destination: string;
	status: 301 | 302;
};

const ruleMap = new Map<string, RedirectRule>();
for (const item of compiledRules as RedirectRule[]) {
	const source = item.source.trim().toLowerCase();
	if (!source) {
		continue;
	}

	ruleMap.set(source, {
		source,
		destination: item.destination,
		status: item.status === 302 ? 302 : 301,
	});
}

export default {
	async fetch(request: Request): Promise<Response> {
		const requestUrl = new URL(request.url);
		const sourceHost = requestUrl.hostname.trim().toLowerCase();
		const rule = ruleMap.get(sourceHost);

		if (!rule) {
			return new Response("No redirect rule for this host.", {
				status: 404,
				headers: { "content-type": "text/plain; charset=utf-8" },
			});
		}

		return Response.redirect(rule.destination, rule.status);
	},
};
