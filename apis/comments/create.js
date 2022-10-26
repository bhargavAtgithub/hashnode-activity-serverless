/**
 * Create a new comment
 * END POINT: /post
 * Methos: POST
 */

import { handler, db } from "../../libs/handler";
import COLLECTIONS from "../../constants/collections";
import { ObjectId } from "mongodb";
import { registerActivity } from "../activity/register";

/**
 *
 * Comment object:
 * {
 *  "postId": "Some random postId"
 *  "content": "Some random comment"
 * }
 *
 * response = {
 *  "statusCode": 200,
 *  "body": "{
 *      \"acknowledged\": true,
 *      \"postId\":\"63519104e662801ecd8fd24a\",
 *      \"commentId":\"63519104e662801ecs3he23b\"
 *  }"
 * }
 *
 */
export const main = handler(async (event, _context) => {
    const body = JSON.parse(event.body);
    const current_datetime = body.commentDate
        ? new Date(body.commentDate)
        : new Date();

    const commentObj = {
        postId: body.postId,
        content: body.content,
        createdAt: current_datetime,
    };

    const [response, postResponse] = await Promise.all([
        db.collection(COLLECTIONS.COMMENTS).insertOne(commentObj),
        db
            .collection(COLLECTIONS.POSTS)
            .findOne({ _id: ObjectId(body.postId) }),
    ]);

    console.log(postResponse);

    const activityResponse = await registerActivity({
        createdAt: current_datetime,
        commentId: response.insertedId,
        postId: body.postId,
        title: postResponse.title,
        type: "COMMENT",
    });

    return {
        acknowledged: response.acknowledged,
        postId: body.postId,
        commentId: response.insertedId,
        activityId: activityResponse.insertedId,
    };
});
