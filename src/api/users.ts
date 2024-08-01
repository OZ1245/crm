import * as sdk from 'node-appwrite';
import client from 'root/appwriteSdk.js';

const users = new sdk.Users(client);

export const fetchUsersList = async (): Promise<sdk.Models.UserList<sdk.Models.Preferences>> => {
  return await users.list()
    .then((response) => response);
}
