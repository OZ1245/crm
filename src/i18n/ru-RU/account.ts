export default {
  noName: 'Без имени',
  detailGeneralInfo: 'Детальная информация',
  tabs: {
    general: 'Общее',
    settings: 'Настройки',
    sessions: 'Сессии',
  },
  general: {
    labels: {
      name: 'Имя',
      email: 'Email',
      registrationDate: 'Дата регистрации',
      status: 'Статус',
      newPassword: 'Новый пароль',
      currentPassword: 'Текущий пароль',
      deleteAccount: 'Удалить профиль'
    },
    buttons: {
      changePassword: 'Изменить пароль',
      updatePassword: 'Обновить пароль',
      cancel: 'Отмена',
      logout: 'Выйти из профиля',
      delete: 'Удалить'
    },
    messages: {
      nameError: 'Ошибка при обновлении имени',
      emailError: 'Ошибка при обновлении Email',
      confirmation: 'Подтверждение',
      confirmEmail: 'Подтвердите свой Email',
      emailVerificationWarning: 'Требуется подтверждение',
      contactToAdmin: 'Обратитесь к администратору сервиса за помощью',
      changePassowordDialogTitle: 'Обновление пароля',
      passwordError: 'Ошибка при изменении пароля',
      nameSuccess: 'Имя изменено',
      emailSuccess: 'Email изменён',
      passwordSuccess: 'Пароль изменён',
      logoutDialogTitle: 'Выход',
      logoutText: 'Вы уверены, что хотите выйти из профиля?',
      logoutError: 'Ошибка при выходе из профиля',
      accountDataError: 'Ошибка при получение данных профиля',
      deleteAccountText: 'Вы уверены, что хотите удалить свой профиль безвозвратно?',
      deleteAccountError: 'При удалении профиля произошла ошибка: {0}',
      deleteAccountSuccess: 'Профиль удалён',
    }
  },
  sessions: {
    labels: {
      detailInfo: 'Детальная информация',
      ip: 'IP адрес',
      countryName: 'Страна',
      osName: 'Операционная система',
      clientName: 'Название клиента',
      clientVersion: 'Версия клиента',
      deviceName: 'Устройство',
      desktop: 'ПК',
      mobile: 'Телефон',
      deviceBrand: 'Бренд устройства',
      deviceModel: 'Модель устройства',
      current: 'Текущая сессия'
    },
    messages: {
      dataError: 'Ошибка получения списка сессий: {0}',
      confirmLogoutAll: 'Вы уверены, что хотите выйти из всех сессий?',
      logoutAllError: 'Ошибка при выходе из сессий:',
      confirmLogoutCurrent: 'Это ваша текущая сессия. Вы уверены, что хотите выйти?',
      confirmLogout: 'Вы уверены, что хотите выйти из данной сессии?',
      logoutError: 'Ошибка при выходе из сессии: {0}',
    },
    buttons: {
      logoutAll: 'Выйти со всех сессий',
      logout: 'Выйти'
    }
  }
}
