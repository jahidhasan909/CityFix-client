import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db(process.env.MONGODB_DB);

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    database: mongodbAdapter(db, {
        client
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                input: true
            },
            status: {
                 type: "string",
                input: true
            }
        }
    },
        session: {
        cookieCache: {
            enabled: true,
            strategy: "jwt",
            maxAge: 60 * 24 * 30,
        },
    },

    plugins: [jwt()],
});