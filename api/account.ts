import { Account, ID } from 'appwrite';
import client from 'root/appwrite.js';
import { ICredintales } from 'types/api/account';

export const account = new Account(client);

export const register = async ({ email, password }: ICredintales) => {
  let response;

  try {
    response = await account.create(
      ID.unique(),
      email,
      password
    );

    console.log('response :>> ', response);
  } catch (error) {
    throw Error(`Ошибка при регистрации нового аккаунта: ${error}`);
  }

  return response;
}
