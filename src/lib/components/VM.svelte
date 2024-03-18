<script lang="ts">
	import Hyperbeam from '@hyperbeam/web';
	import { onDestroy, onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	export let embedUrl: string;

	let vmNode: HTMLDivElement;
	let hyperbeam: Awaited<ReturnType<typeof Hyperbeam>>;

	export function destroy() {
		hyperbeam?.destroy();
	}

	export async function initialize() {
		destroy();
		hyperbeam = await Hyperbeam(vmNode, embedUrl);
		// hyperbeam.tabs.setZoom(Math.round(window.innerWidth / vmNode.clientWidth));
	}

	onMount(initialize);

	onDestroy(destroy);
</script>

<div class={twMerge('aspect-video w-full', !!hyperbeam && 'cursor-none')} bind:this={vmNode}></div>
