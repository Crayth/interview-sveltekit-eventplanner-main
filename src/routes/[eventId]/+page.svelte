<script lang="ts">
    import type { PageData } from "./$types";

    let {data}: {data: PageData} = $props();
</script>

<div class="container mx-auto p-4 max-w-lg">
    {#await data.streamed.event}
        <p class="text-center text-gray-500">Loading...</p>
    {:then event}
        <div class="bg-white shadow-md rounded-lg p-6">
            {#if event}
                <h2 class="text-2xl font-bold mb-4">{event.id}: {event.title}</h2>
                <p class="text-gray-700 mb-2"><strong>Description:</strong> {event.description}</p>
                <p class="text-gray-700 mb-2"><strong>Date:</strong> {event.date}</p>
                <a class="btn btn-secondary mt-4" href="/">Back to Events</a>
            {/if}
        </div>
    {:catch error}
        <p class="text-center text-red-500">{error.message}</p>
    {/await}
</div>