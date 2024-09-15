import client from 'root/appwrite';
import { Databases, ID, Models, Permission, Role } from 'appwrite';
import { IProject, IProjectDocument } from '@/types/api/project';

const databases = new Databases(client);
const databaseId = '66d4b1ba0005143ff56a';
const projectsCollectionId = '66d5cb7d002d3a94877b';

const fetchProjects = async (queries: string[] = []): Promise<Models.DocumentList<IProjectDocument>> => {
  return await databases.listDocuments(
    databaseId,
    projectsCollectionId,
    queries
  );
}

const createProject = async (data: IProject): Promise<IProjectDocument> => {
  return await databases.createDocument(
    databaseId,
    projectsCollectionId,
    ID.unique(),
    data,
    [
      Permission.read(Role.users('verified')),
      Permission.update(Role.users('verified')),
      Permission.delete(Role.users('verified')),
      Permission.write(Role.users('verified')),
    ]
  )
}

const fetchProject = async (projectId: string, queries: string[] = []): Promise<IProjectDocument> => {
  return await databases.getDocument(
    databaseId,
    projectsCollectionId,
    projectId,
    queries
  )
}

export default {
  fetchProjects,
  createProject,
  fetchProject
}
