import { fetchEventById, deleteEventById } from "$lib/server/remote-events";
import type { Actions, PageServerLoad } from "./$types";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
    return {
        streamed: {
            event: fetchEventById(parseInt(params.eventId)),
        }
    };
};

export const actions: Actions = {
    delete: async ({ request }) => {
        const formData = await request.formData();
        const eventId = formData.get('eventId')?.toString();

        if (!eventId) {
            return fail(400, { error: 'Event ID is required' });
        }

        try {
            await deleteEventById(Number(eventId));
            return { success: true };
        } catch (err) {
            return fail(500, { error: 'Failed to delete event', err });
        }
    }
};