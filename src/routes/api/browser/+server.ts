import { json, type RequestHandler } from '@sveltejs/kit';
import { HYPERBEAM_API_KEY } from '$env/static/private';
import db from '$lib/db';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { user, instanceId, regionInfo } = body;
	const existingInstance = await db.instance.findFirst({
		where: {
			id: instanceId
		}
	});
	if (existingInstance) {
		return json({ embedUrl: existingInstance.embedUrl });
	}
	const response = await fetch('https://engine.hyperbeam.com/v0/vm', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${HYPERBEAM_API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			ublock: true,
			region: regionInfo.region,
			searchEngine: 'google',
			tag: instanceId
		})
	});
	const data = await response.json();
	const newInstance = await db.instance.create({
		data: {
			id: instanceId,
			ownerId: user.id,
			region: regionInfo.region,
			embedUrl: data.embed_url,
			sessionId: data.session_id,
			adminToken: data.admin_token
		}
	});

	console.log({ newInstance });

	return json({ embedUrl: newInstance.embedUrl });
};
