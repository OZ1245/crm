import { Account, ID, Models } from 'appwrite';
import client from 'root/appwrite.js';
import { ICredintales, ICredintalesPassword } from '@/types/api/account';

const account = new Account(client);

/**
 * Регистрация нового пользователя
 *
 * @param   {string}        email     Email
 * @param   {string}        password  Пароль
 *
 * @return  {Promise<User>}                    Данные пользователя
 */
const register = async ({ email, password }: ICredintales): Promise<Models.User<Models.Preferences>> => {
  return await account.create(
    ID.unique(),
    email,
    password
  );
}

/**
 * Вход пользователя в аккаунт
 *
 * @param   {string}        email       Email
 * @param   {string}        password    Пароль
 *
 * @returns {Promise<Session>}                   Данные сессии
 */
const login = async ({ email, password }: ICredintales): Promise<Models.Session> => {
  return await account.createEmailPasswordSession(email, password);
}

/**
 * Выход пользователя из аккаунта
 *
 * @param   {string}   sessionId  Идентификатор сессии ($id)
 *
 * @return  {Promise<any>}        Ответ с кодом 204
 */
const logout = async (sessionId: string): Promise<any> => {
  return await account.deleteSession(sessionId);
}

/**
 * Выход пользователя со всех сессий
 *
 * @return  {Promise<any>}  Ответ с кодом 204
 */
const logoutAll = async (): Promise<any> => {
  return await account.deleteSessions();
}

/**
 * Блокировка пользователя.
 * Аккаунт не удаляется, а закрывается возможность в него зайти.
 * Удаление аккаунта можно воспроизвести в User API с помощью библиотеки SDK.
 *
 * @returns {Promise<User>} Данные пользователя
 */
const updateStatus = async (): Promise<Models.User<Models.Preferences>> => {
  return await account.updateStatus();
}

/**
 * Получить данные пользователя
 *
 * @returns {Promise<User>} Данные пользователя
 */
const fetchAccount = async (): Promise<Models.User<Models.Preferences>> => {
  return await account.get();
}

/**
 * Получить список всех активных сессий.
 *
 * @returns {Promise<SessionList>}  Список сессий пользователя
 */
const fetchSessions = async (): Promise<Models.SessionList> => {
  return await account.listSessions();
}

/**
 * Обновление имени пользователя
 *
 * @returns {Promise<User>} Данные пользователя
 */
const updateName = async (name: string): Promise<Models.User<Models.Preferences>> => {
  return await account.updateName(name);
}

/**
 * Обновление email пользователя
 *
 * @param {string}  email     Email пользователя
 * @param {string}  password  Пароль пользователя
 *
 * @returns {Promise<User>}   Данные пользователя
 */
const updateEmail = async ({ email, password }: ICredintales): Promise<Models.User<Models.Preferences>> => {
  return await account.updateEmail(
    email,
    password
  );
}

/**
 * Обновление пароля
 *
 * @param {string}  password    Новый пароль
 * @param {string}  oldPassword Текущий пароль
 *
 * @returns {Promise<User>}     Данные пользователя
 */
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
  logoutAll,
  updateStatus,
  fetchAccount,
  updateName,
  updateEmail,
  updatePassword,
  fetchSessions
}
