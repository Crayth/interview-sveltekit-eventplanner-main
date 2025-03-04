<script lang="ts">
    import { enhance } from '$app/forms';

    export let eventValues: {title: string, description: string, date: string, id?: string} = { title: '', description: '', date: '', id: '' };
    export let isEditMode = false;
    export let isLoading = false;
    export let error: string | null = null;
</script>



<form method="POST" class="space-y-4" use:enhance={() => {
    isLoading = true;
    error = null;
    
    return async ({ result, update }) => {
        await update();
        if (result.type == 'failure') {
            error = result.data?.error as string | null;
            isLoading = false;
            return;
        }
        isLoading = false;
    }
}}>
    <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
        <input type="text" id="title" name="title" placeholder="Title" class="input input-bordered w-full" required bind:value={eventValues.title}>
    </div>
    <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea class="textarea textarea-bordered w-full" id="description" name="description" rows="4" placeholder="Description" bind:value={eventValues.description}></textarea>
    </div>
    <div>
        <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
        <input type="datetime-local" id="date" name="date" class="input input-bordered w-full" required bind:value={eventValues.date}>
    </div>
    <div>
        <button id="submit-button" class="btn btn-primary w-full" type="submit" disabled={isLoading}>
            {#if isLoading}
                <span class="loader"></span> {isEditMode ? 'Updating...' : 'Creating...'}
            {:else}
                {isEditMode ? 'Update Event' : 'Create Event'}
            {/if}
        </button>
    </div>
    {#if error}
        <div class="alert alert-error mb-4">
            <span id='form-error'>{error}</span>
        </div>
    {/if}
</form>