// In a real application, you should use environment variables for sensitive data.
// For this example, we'll hardcode the value.
// You can create a .env.local file and add your MONGODB_URI there.
// Example: MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/hostelpro";

export { MONGODB_URI };
