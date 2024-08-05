import { Client, Account } from 'appwrite';

const client = new Client();

const endpoint = process.env.PROJECT_ENDPOINT;
const projectId = process.env.PROJECT_ID;

client
  .setEndpoint(endpoint)
  .setProject(projectId)

const account = new Account(client);

try {
  await account.get();
} catch (error) {
  const sessionJSON = localStorage.getItem('accountSession');
  const session = sessionJSON ? JSON.parse(sessionJSON) : null;

  if (session && (error.code === 401 || error.type === 'general_unauthorized_scope')) {
    localStorage.removeItem('account');
    localStorage.removeItem('accountSession');
    window.location.href = '/#/auth/login';
    throw new Error(error);
  }

  if (!session) {
    window.location.href = '/#/auth/login';
  }
}

export default client;
