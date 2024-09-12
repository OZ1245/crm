import { Models } from 'appwrite';

export interface IProject extends Models.Document {
  // Заголовок / название
  title: string;
  // Текстовый идентификатор - сокращенное название проекта.
  textId: string;
  // Описание
  description: string;
  // id пользователя
  author: string;
  // id ответственного пользователя
  assigned: string;
  // id подписчиков
  subscribes: string[];
}
