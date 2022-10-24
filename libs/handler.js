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
                throw error;
            }
        }

        let body, statusCode;

        try {
            body = await lambda(event, context);
            statusCode = 200;
        } catch (error) {
            body = { error: error.message };
            statusCode = 500;
        }

        return {
            status: statusCode,
            body: JSON.stringify(body),
        };
    };
};

export { db, handler };
