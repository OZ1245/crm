import { Client } from 'appwrite';

const client = new Client();

client
  .setEndpoint(process.env.VUE_APP_ENDPOINT)
  .setProject(process.env.VUE_APP_PROJECT_ID)

export default client;
