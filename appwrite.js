import { Client } from 'appwrite';

const client = new Client();

const endpoint = process.env.PROJECT_ENDPOINT;
const projectId = process.env.PROJECT_ID;

client
  .setEndpoint(endpoint)
  .setProject(projectId);

export default client;
