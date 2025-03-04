import { createEvent } from "$lib/server/remote-events";
import type { Actions } from "./$types";
import { fail, redirect, type RequestEvent, isRedirect } from "@sveltejs/kit";

export const actions: Actions = {
    default: async (event: RequestEvent) => {
        const { request } = event;
        const formdata = await request.formData();
        const title = formdata.get('title')?.toString();
        const description = formdata.get('description')?.toString();
        const date = formdata.get('date')?.toString();

        // Validate form data
        if (!title || !date) {
            return fail(400, { error: 'Title and Date are required', eventValues: { title, description, date } });
        }

        const eventDate = new Date(date);
        const currentDate = new Date();
        if (isNaN(eventDate.getTime())) {
            return fail(400, { error: 'Invalid date', eventValues: { title, description, date } });
        } else if (eventDate < currentDate) {
            console.log('fail?');
            return fail(400, { error: 'The date is in the past', eventValues: { title, description, date } });
        }

        try {
            const response = await createEvent({ title, description, date });

            if (!response) {
                return fail(500, { error: 'Failed to create event', eventValues: { title, description, date } });
            }

            redirect(301, `/${response.id}`);
        }  catch (err) {
            if (isRedirect(err)) throw err;
            const errorMessage = (err as Error).message;
            return fail(500, { error: 'Failed to create event', eventValues: { title, description, date }, err: errorMessage });
        }
    }
};