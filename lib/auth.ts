import { setServers } from "node:dns/promises";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { USER_ROLES } from "@/lib/roles";

// Force public DNS so MongoDB SRV records resolve reliably in this environment.
setServers(["1.1.1.1", "8.8.8.8"]);

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not configured.");
}

// Reuse a single client across hot reloads and warm serverless invocations.
// A smaller pool avoids exhausting Atlas connection limits on Vercel.
const globalForMongo = globalThis as unknown as {
  pizzaHubMongoClient?: MongoClient;
};

const client =
  globalForMongo.pizzaHubMongoClient ??
  new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10_000,
  });

globalForMongo.pizzaHubMongoClient = client;

export const db = client.db();

export const auth = betterAuth({
  // No `client` option: avoids transaction sessions that fail when the
  // serverless runtime tears down the topology between invocations.
  database: mongodbAdapter(db),

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
