import { db } from "../../libs/handler";

const registerActivity = async (activity) => {
    try {
        const response = await db.collection("activities").insertOne(activity);

        return response;
    } catch (error) {
        console.log(error);
        return error;
    }
};

export { registerActivity };
