import { Storage, ID, Models, Permission, Role, ImageGravity } from 'appwrite';
import client from 'root/appwrite';

interface ICreateFileParams {
  bucketId: string;
  file: File;
  permissions?: string[];
}

interface IFetchFilePreviewParams {
  bucketId: string,
  fileId: string;
  width?: number;
  height?: number;
  quality?: number;
}

interface IGetFileParams {
  bucketId: string;
  fileId: string;
}

const storage = new Storage(client);

/**
 * Добавить файл в хранилище
 *
 * @param   {string}        bucketId    Id контейнера хранилища
 * @param   {FIle}          file        Бинарная строка загружаемого файла
 * @param   {Array}         permissions Разрешения
 *
 * @returns {Promise<File>}             Бинарный код файла
 */
const createFile = async ({bucketId, file, permissions = []}: ICreateFileParams): Promise<Models.File> => {
  return await storage.createFile(
    bucketId,
    ID.unique(),
    file,
    permissions
      ? permissions
      : [
        Permission.read(Role.users('verified')),
        Permission.create(Role.users('verified')),
        Permission.update(Role.users('verified')),
        Permission.delete(Role.users('verified')),
        Permission.write(Role.users('verified')),
      ]
  )
}

/**
 * Получить файл для превью
 *
 * @param {string}  bucketId  Id контейнера хранилища
 * @param {string}  fileId    Id файла
 * @param {number}  width     Ширина изображения
 * @param {number}  height    Высота изображения
 * @param {number}  quality   Качество
 *
 * @returns {Promise<URL>}    Превью файла - строка URL
 */
const fetchFilePreview = async ({bucketId, fileId, width = 0, height = 0, quality = 100}: IFetchFilePreviewParams): Promise<URL> => {
  return await storage.getFilePreview(
    bucketId,
    fileId,
    width,
    height,
    ImageGravity.Center,
    quality,
  );
}

/**
 * Удалить файл из хранилища
 *
 * @param   {string}  bucketId  Id контейнера хранилища
 * @param   {string}  fileId    Id файла
 *
 * @returns {Promise<any>}      Код 200
 */
const deleteFile = async ({bucketId, fileId}: IGetFileParams): Promise<any> => {
  return await storage.deleteFile(
    bucketId,
    fileId
  );
}

export default {
  createFile,
  fetchFilePreview,
  deleteFile
}
