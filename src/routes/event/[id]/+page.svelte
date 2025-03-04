<script lang="ts">
    import { page } from '$app/stores';
    import EventForm from '$lib/components/EventForm.svelte';
    import { onMount } from 'svelte';

    let isLoading = false;
    let error: string | null = null;
    let eventValues = { title: '', description: '', date: '', id: '' };
    let isEditMode = false;
    let eventPromise: Promise<any>;

    $: {
        const { error: formError, streamed } = $page.data;
        error = formError;
        eventPromise = streamed.event;
    }

    $: if (eventPromise) {
        eventPromise.then(event => {
            if (event) {
                eventValues = { title: event.title, description: event.description, date: event.date, id: event.id };
                isEditMode = true;
            }
        }).catch(err => {
            error = err.message;
        });
    }

    onMount(() => {
        eventPromise = $page.data.streamed.event;
    });
</script>

<div class="container mx-auto p-4 max-w-lg">
    {#await eventPromise}
        <p>Loading...</p>
    {:then streamed}
        <a class="btn btn-secondary mb-4" href="/">&lt; Back to Events</a>
        <EventForm
            {eventValues}
            {isEditMode}
            {isLoading}
            {error}
        />
    {:catch error}
        <p>{error.message}</p>
    {/await}
</div>