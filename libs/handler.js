import { MongoClient } from "mongodb";

const uri = `mongodb+srv://hashnode:${process.env.HASHNODE_PASSWORD}@hashnode-activity-clust.wvapahl.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);
let db;

const createConnection = async () => {
    await client.connect();
    db = client.db("hashnode-activity-feed");
};

const handler = (lambda) => {
    return async function (event, context) {
        if (!client.isConnected) {
            try {
                await createConnection();
            } catch (error) {
                console.log(error);
                throw error;
            }
        }

        let body, statusCode;

        try {
            body = await lambda(event, context);
            statusCode = 200;
        } catch (error) {
            console.log(error);
            body = { error: error.message };
            statusCode = 500;
        }

        /**
         * For cloudwatch
         */
        console.log(body);
        console.log(statusCode);

        return {
            statusCode,
            body: JSON.stringify(body),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
        };
    };
};

export { db, handler };
