/**
 * Get all comments
 * Pagination
 * END POINT: /comments?page=0
 * Post Body: { postId: post_id }
 * METHODS: GET
 */

import { handler, db } from "../../libs/handler";
import COLLECTIONS from "../../constants/collections";

const getAPage = async (options, postId, commentId) => {
    let comments = [];
    let commentFound = false;

    let cursor = db
        .collection(COLLECTIONS.COMMENTS)
        .find({ postId: postId }, options)
        .sort({ createdAt: -1 });

    await cursor.forEach((doc) => {
        if (commentId && commentId == doc._id) {
            commentFound = true;
        }
        comments.push(doc);
    });

    return {
        comments,
        commentFound,
    };
};

export const main = handler(async (event, _context) => {
    let comments = [];
    const { postId, commentId } = JSON.parse(event.body);
    let page = event.queryStringParameters?.page;
    page = page ? Number(page) : 0;
    let commentFound = false;
    let lastCount = 0;
    do {
        console.log("doing");
        const skipTo = page * 10;
        const options = {
            skip: skipTo,
            limit: 10,
        };
        let pageResponse = await getAPage(options, postId, commentId);
        comments = comments.concat(pageResponse.comments);
        commentFound = pageResponse.commentFound;
        lastCount = pageResponse.comments.length;
        page += 1;
    } while (commentId && !commentFound && lastCount === 10);

    return { comments, page: page - 1, moreRecords: comments.length >= 10 };
});
