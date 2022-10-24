/**
 * Get post data using id of the post.
 * END POINT: /post/:id
 * METHOS: GET
 */

import { handler, db } from "../../libs/handler";
import { ObjectId } from "mongodb";
import COLLECTIONS from "../../constants/collections";

/**
 * {
 *  "statusCode": 200,
 *  "body": "{
 *      \"_id\":\"634b0f4982f21f14b3aaeea8\",
 *      \"title\":\"First mini post\",
 *      \"content\":\"Some random content for the post. I think it can be as long as it wants to be. \\n\\nGuess I'll make you of this alot.\",
 *      \"createdAt\":\"2022-10-15T09:30:00.000Z\"
 *  }"
 * }
 */
export const main = handler(async (event, _context) => {
    const postData = await db
        .collection(COLLECTIONS.POSTS)
        .findOne({ _id: ObjectId(event.pathParameters.id) });

    return postData;
});
