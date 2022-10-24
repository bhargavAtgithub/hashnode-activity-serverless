/**
 * Get activities
 * Pagination
 * END POINT: /activities?page=1
 * METHODS: GET
 */

import { handler, db } from "../../libs/handler";
import COLLECTIONS from "../../constants/collections";

export const main = handler(async (event, _context) => {
    let activities = [];
    const page = event.queryStringParameters?.page;
    const pageNumber = Number(page);
    const skipTo = pageNumber * 10;
    const options = {
        _id: -1,
        skip: skipTo,
        limit: 10,
    };
    let cursor = db.collection(COLLECTIONS.ACTIVITIES).find({}, options);

    let dateActivities = {
        date: null,
        activities: [],
    };

    await cursor.forEach((doc) => {
        const { date } = dateActivities;
        let docDateTime = new Date(doc.createdAt).setHours(0, 0, 0, 0);
        docDateTime = new Date(docDateTime).toISOString();

        if (date !== null && docDateTime !== date) {
            activities.push(dateActivities);
            dateActivities.activities = [doc];
        } else {
            dateActivities.activities.push(doc);
        }
        dateActivities.date = docDateTime;
    });

    activities.push(dateActivities);

    return activities;
});
