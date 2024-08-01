const sdk = require('node-appwrite');

const client = new sdk.Client();

const endpoint = process.env.PROJECT_ENDPOINT;
const projectId = process.env.PROJECT_ID;
const secretKey = process.env.PROJECT_SECRET_KEY;

client
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(secretKey);

export default client;
