<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from "./$types";
    import { SvelteMap } from 'svelte/reactivity';

    let { data }: { data: PageData } = $props();
    let loadingStates = new SvelteMap<number, boolean>();

    function setLoading(eventId: number, isLoading: boolean) {
        loadingStates.set(eventId, isLoading);
    }
</script>

<div class="container mx-auto p-4">
    <h1 class="text-xl">
        <span class='mr-4'>Events</span>
        <a id="add-event" class="btn btn-primary mt-4" href="/event/new" role="button">Add Event</a>
    </h1>
    {#await data.streamed.events}
        <p>Loading...</p>
    {:then events}
        {#if events.length === 0}
            <p class="mt-4">No events found.</p>
        {:else}
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {#each events as event}
                    <div class="card bg-base-100 w-96 shadow-md mt-4">
                        <div class="card-body">
                            <h2 id={`card-title-${event.id}`} class="card-title">{event.id}: {event.title}</h2>
                            <p id={`event-description-${event.id}`}>{event.description}</p>
                            <p id={`event-date-${event.id}`}>{event.date}</p>
                            <div class="flex space-x-2">
                                <a id={`event-button-${event.id}`} class="btn btn-secondary mt-2" href={`/event/${event.id}`} role="button">Edit Event</a>
                                <form method="POST" action="?/delete" class="inline" use:enhance={() => {
                                    setLoading(event.id, true);
                                    
                                    return async ({ update }) => {
                                        await update();
                                        setLoading(event.id, false);
                                    }
                                }}>
                                    <input type="hidden" name="eventId" value={event.id} />
                                    <button class="btn btn-error mt-2" type="submit" disabled={loadingStates.get(event.id)}>
                                        {#if loadingStates.get(event.id)}
                                            <span class="loader"></span> Deleting...
                                        {:else}
                                            Delete Event
                                        {/if}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    {:catch error}
        <p>{error.message}</p>
    {/await}
</div>