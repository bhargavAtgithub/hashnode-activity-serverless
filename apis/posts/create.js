/**
 * Create a new post OR Update and existing post
 * END POINT: /post
 * Methos: POST
 */

import { handler, db } from "../../libs/handler";
import COLLECTIONS from "../../constants/collections";
import { registerActivity } from "../activity/register";

/**
 *
 * post object to create:
 * {
 *  "title": "Some random title"
 *  "content": "Some random content"
 * }
 *
 * response = {
 *  "statusCode": 200,
 *  "body": "{
 *      \"acknowledged\": true,
 *      \"postId\":\"63519104e662801ecd8fd24a\",
 *  }"
 * }
 *
 * post object to update:
 * {
 *  "id": "63519104e662801ecd8fd24a"
 *  "title": "Updated title"
 *  "content": "Updated content"
 * }
 *
 * response = {
 *  "statusCode": 200,
 *  "body": "{
 *      \"acknowledged\": true,
 *      \"postId\":\"63519104e662801ecd8fd24a\",
 *  }"
 * }
 */
export const main = handler(async (event, _context) => {
    const body = JSON.parse(event.body);
    const current_datetime = body.postDate
        ? new Date(body.postDate)
        : new Date();

    const postObj = {
        title: body.title,
        content: body.content,
    };

    let response;
    postObj["createdAt"] = current_datetime;
    response = await db.collection(COLLECTIONS.POSTS).insertOne(postObj);
    let activityResponse = await registerActivity({
        createdAt: current_datetime,
        postId: response.insertedId,
        title: postObj["title"],
        type: "WRITE",
    });

    return {
        acknowledged: response.acknowledged,
        postId: response.insertedId,
        activityId: activityResponse.insertedId,
    };
});
