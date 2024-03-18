<script lang="ts">
	import VM from './VM.svelte';
	import { getRegionInfo } from '@hyperbeam/web';

	export let user: Record<string, unknown>;
	export let instanceId: string;

	const getEmbedUrl = async () => {
		const regionInfo = await getRegionInfo();
		const response = await fetch('/api/browser', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ user, instanceId, regionInfo })
		});
		const data = await response.json();
		return data.embedUrl;
	};
</script>

{#await getEmbedUrl()}
	<span>loading...</span>
{:then embedUrl}
	<VM {embedUrl} />
{:catch error}
	<span>{error.message}</span>
{/await}
