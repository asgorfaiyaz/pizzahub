import { setServers } from "node:dns/promises";
// Force Node.js to use Cloudflare and Google DNS
setServers(["1.1.1.1", "8.8.8.8"]);
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { USER_ROLES } from "@/lib/roles";

const client = new MongoClient(process.env.MONGODB_URI as string);
export const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 6,
  },
  user: {
    additionalFields: {
      role: {
        type: [...USER_ROLES],
        required: false,
        defaultValue: "customer",
        input: true,
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      businessName: {
        type: "string",
        required: false,
        input: true,
      },
      restaurantLocation: {
        type: "string",
        required: false,
        input: true,
      },
      restaurantOpeningTime: {
        type: "string",
        required: false,
        input: true,
      },
      restaurantClosingTime: {
        type: "string",
        required: false,
        input: true,
      },
      restaurantPhone: {
        type: "string",
        required: false,
        input: true,
      },
      subscriptionPlan: {
        type: ["free", "premium"],
        required: false,
        defaultValue: "free",
        input: false,
      },
      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
