export default {
  noName: 'John Doe',
  detailGeneralInfo: 'Detail info',
  tabs: {
    general: 'General',
    settings: 'Settings',
    sessions: 'Sessions',
  },
  general: {
    labels: {
      name: 'Name',
      email: 'Email',
      registrationDate: 'Registration date',
      status: 'Status',
      newPassword: 'New password',
      currentPassword: 'Current password',
      deleteAccount: 'Delete account'
    },
    buttons: {
      changePassword: 'Update password',
      updatePassword: 'Update password',
      cancel: 'Cancel',
      logout: 'Log out',
      delete: 'Delete'
    },
    messages: {
      nameError: 'Error updating name',
      emailError: 'Error updating email',
      confirmation: 'Confirmation',
      confirmEmail: 'Confirm your Email',
      emailVerificationWarning: 'Verification required',
      contactToAdmin: 'Contact the service administrator for help',
      changePassowordDialogTitle: 'Password update',
      passwordError: 'Error changing password',
      nameSuccess: 'Name has been changed',
      emailSuccess: 'Email has been changed',
      passwordSuccess: 'Your password has been changed',
      logoutDialogTitle: 'Log out',
      logoutText: 'Are you sure you want to log out of your account?',
      logoutError: 'Error when logging out of profile',
      accountDataError: 'Error while retrieving account information',
      deleteAccountText: 'Are you sure you want to permanently delete your account?',
      deleteAccountError: 'An error occurred when deleting your account: {0}',
      deleteAccountSuccess: 'Account has been deleted',
    }
  },
  sessions: {
    labels: {
      detailInfo: 'Detail info',
      ip: 'IP address',
      countryName: 'Country',
      osName: 'Operating system',
      clientName: 'Client name',
      clientVersion: 'Client version',
      deviceName: 'Device',
      desktop: 'PC',
      mobile: 'Mobile phone',
      deviceBrand: 'Device brand',
      deviceModel: 'Device model',
      current: 'Current session'
    },
    messages: {
      dataError: 'Error getting session list: {0}',
      confirmLogoutAll: 'Are you sure you want to log out of all sessions?',
      logoutAllError: 'Error when logging out of sessions:',
      confirmLogoutCurrent: 'This is your current session. Are you sure you want to go out?',
      confirmLogout: 'Are you sure you want to log out of this session?',
      logoutError: 'Error when logging out of session: {0}',
    },
    buttons: {
      logoutAll: 'Log out from all sessions',
      logout: 'Log out'
    }
  }
}
