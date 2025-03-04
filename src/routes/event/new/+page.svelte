<script lang="ts">
    import { page } from '$app/stores';
    import EventForm from '$lib/components/EventForm.svelte';
    let isLoading = false;
    let error: string | null = null;
    let eventValues = { title: '', description: '', date: '' };

    $: {
        const { error: formError, values: formValues } = $page.data;
        error = formError;
        eventValues = formValues || eventValues;
    }
</script>

<div class="container mx-auto p-4 max-w-lg">
    <div class="flex justify-between items-center mb-4">
        <h1 id='add-event-title' class="text-xl">Add Event</h1>
        <a class="btn btn-secondary mb-4" href="/">&lt; Back to Events</a>
    </div>
    <EventForm
        {eventValues}
        {isLoading}
        {error}
    />
</div>