import { Account, ID, Models } from 'appwrite';
import client from 'root/appwrite.js';
import { ICredintales, ICredintalesPassword } from '@/types/api/account';

const account = new Account(client);

const register = async ({ email, password }: ICredintales) => {
  return await account.create(
    ID.unique(),
    email,
    password
  );
}

const login = async ({ email, password }: ICredintales): Promise<Models.Session> => {
  return await account.createEmailPasswordSession(email, password);
}

const logout = async (sessionId: string): Promise<any> => {
  return await account.deleteSession(sessionId);
}

const fetchAccount = async (): Promise<Models.User<Models.Preferences>> => {
  return await account.get();
}

const updateName = async (name: string): Promise<Models.User<Models.Preferences>> => {
  return await account.updateName(name);
}

const updateEmail = async ({ email, password }: ICredintales): Promise<Models.User<Models.Preferences>> => {
  return await account.updateEmail(
    email,
    password
  );
}

const updatePassword = async ({ password, oldPassword }: ICredintalesPassword): Promise<Models.User<Models.Preferences>> => {
  return await account.updatePassword(
    password,
    oldPassword
  );
}

export default {
  register,
  login,
  logout,
  fetchAccount,
  updateName,
  updateEmail,
  updatePassword
}
