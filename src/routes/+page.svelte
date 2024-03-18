<script lang="ts">
	import { PUBLIC_DISCORD_CLIENT_ID } from '$env/static/public';
	import Browser from '$lib/components/Browser.svelte';
	import { DiscordSDK, patchUrlMappings } from '@discord/embedded-app-sdk';

	const setupDiscordSDK = async () => {
		const discordSdk = new DiscordSDK(PUBLIC_DISCORD_CLIENT_ID);
		patchUrlMappings([
			{
				prefix: '/hyperbeam/{subdomain}',
				target: '{subdomain}.hyperbeam.com'
			}
		]);

		await discordSdk.ready();
		await discordSdk.commands.encourageHardwareAcceleration();

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

		const { user } = await discordSdk.commands.authenticate({ access_token });

		return {
			user,
			instanceId: discordSdk.instanceId
		};
	};
</script>

<div class="absolute bottom-0 left-0 right-0 top-0">
	<div class="bg-primary text-primary-foreground relative h-full w-full">
		<span>hello world</span>
		{#await setupDiscordSDK()}
			<span>loading...</span>
		{:then { user, instanceId }}
			<span>ready</span>
			<Browser {user} {instanceId} />
		{:catch error}
			<span>{error.message}</span>
		{/await}
	</div>
</div>
