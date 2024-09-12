import client from 'root/appwrite';
import { Databases, Models } from 'appwrite';
import { IProject } from '@/types/api/project';

const databases = new Databases(client);
const databaseId = '66d4b1ba0005143ff56a';
const projectsCollectionId = '66d5cb7d002d3a94877b';

const fetchProjects = async (queries: string[] = []): Promise<Models.DocumentList<IProject>> => {
  return await databases.listDocuments(
    databaseId,
    projectsCollectionId,
    queries
  );
}

export default {
  fetchProjects
}
