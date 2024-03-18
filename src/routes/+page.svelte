<script lang="ts">
	import { PUBLIC_DISCORD_CLIENT_ID } from '$env/static/public';
	import { DiscordSDK } from '@discord/embedded-app-sdk';

	const setupDiscordSDK = async () => {
		const discordSdk = new DiscordSDK(PUBLIC_DISCORD_CLIENT_ID);

		await discordSdk.ready();

		const { code } = await discordSdk.commands.authorize({
			client_id: PUBLIC_DISCORD_CLIENT_ID,
			response_type: 'code',
			state: '',
			prompt: 'none',
			scope: ['identify', 'guilds']
		});

		const response = await fetch('/api/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ code })
		});

		const { access_token } = await response.json();

		await discordSdk.commands.authenticate({ access_token });
	};
</script>

<div>
	<span>hello world</span>
	{#await setupDiscordSDK()}
		<span>loading...</span>
	{:then}
		<span>ready</span>
	{:catch error}
		<span>{error.message}</span>
	{/await}
</div>
