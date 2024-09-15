import { Models } from 'appwrite';

export interface IProject {
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

export interface IProjectDocument extends IProject, Models.Document {}
