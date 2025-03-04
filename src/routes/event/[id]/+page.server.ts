import { updateEventById, fetchEventById } from "$lib/server/remote-events";
import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect, isRedirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
    return {
        streamed: {
            event: fetchEventById(Number(params.id))
        }
    }
};

export const actions: Actions = {
    default: async (event) => {
        const { request, params } = event;
        const formdata = await request.formData();
        const title = formdata.get('title')?.toString();
        const description = formdata.get('description')?.toString();
        const date = formdata.get('date')?.toString();

        // Validate form data
        if (!title || !date) {
            return fail(400, { error: 'Title and Date are required', values: { title, description, date } });
        }

        const eventDate = new Date(date);
        if (isNaN(eventDate.getTime()) || eventDate < new Date()) {
            return fail(400, { error: 'Invalid or past date', values: { title, description, date } });
        }

        try {
            const eventId = params.id;
            const response = await updateEventById(Number(eventId), { title, description, date });
            if (!response) {
                return fail(500, { error: 'Failed to create event', values: { title, description, date } });
            }
            
            redirect(303, `/${response.id}`);
        } catch (err) {
            if (isRedirect(err)) throw err;
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            return fail(500, { error: 'Failed to update event', values: { title, description, date }, err: errorMessage });
        }
    }
};