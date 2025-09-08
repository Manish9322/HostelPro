// In a real application, you should use environment variables for sensitive data.
// You can create a .env file and add your MONGODB_URI there.
// Example: MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority

const MONGODB_URI = process.env.MONGODB_URI;

export { MONGODB_URI };
