import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { USER_ROLES } from "@/lib/roles";

const rawUri = process.env.MONGODB_URI;

if (!rawUri) {
  throw new Error("MONGODB_URI is not configured.");
}

const uri: string = rawUri;

function createAuth(client: MongoClient) {
  return betterAuth({
    database: mongodbAdapter(client.db()),
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
}

type AuthInstance = ReturnType<typeof createAuth>;

interface AuthState {
  client: MongoClient;
  auth: AuthInstance;
}

const globalForAuth = globalThis as unknown as {
  pizzaHubAuthState?: AuthState;
};

function createState(): AuthState {
  const client = new MongoClient(uri, {
    maxPoolSize: 5,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 10_000,
    connectTimeoutMS: 10_000,
    retryWrites: true,
    retryReads: true,
  });

  return { client, auth: createAuth(client) };
}

/**
 * `client.topology` is internal, but it is the only way to detect the state
 * the MongoDB driver leaves behind after a failed initial handshake: in v6/v7
 * `Topology.connect()` closes the topology on failure and never reopens it.
 * Every later operation on that client then throws `MongoTopologyClosedError`.
 */
function isTopologyDestroyed(client: MongoClient): boolean {
  const topology = (
    client as unknown as { topology?: { isDestroyed?: () => boolean } }
  ).topology;
  return topology?.isDestroyed?.() ?? false;
}

function getState(): AuthState {
  let state = globalForAuth.pizzaHubAuthState;

  if (!state || isTopologyDestroyed(state.client)) {
    state = createState();
    globalForAuth.pizzaHubAuthState = state;
  }

  return state;
}

/**
 * Consumers import `auth` once at module load. A proxy resolves the current
 * state on every call so a client replaced after a failed connection is picked
 * up automatically by both `auth.api.*` and `toNextJsHandler(auth)`.
 */
export const auth = new Proxy((() => {}) as unknown as AuthInstance, {
  apply(_target, _thisArg, args: unknown[]) {
    const instance = getState().auth;
    return Reflect.apply(instance.handler, instance, args);
  },
  get(_target, property) {
    const instance = getState().auth;
    const value = Reflect.get(instance, property, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
  has(_target, property) {
    return Reflect.has(getState().auth, property);
  },
});
