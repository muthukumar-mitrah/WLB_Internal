import { ROUTES } from './index';

export const PREFERENCES = [
  {
    id: 'unit',
    titleKey: 'accountSettings.preferences.unit',
    imageSource: require('../assets/icons/unit_icon.png'),
    type: 'segmented',
  },
  {
    id: 'profileVisibility',
    titleKey: 'accountSettings.preferences.profileVisibility',
    imageSource: require('../assets/icons/profile_visibility.png'),
    type: 'navigation',
    route: ROUTES.PROFILE_VISIBILITY,
  },
  {
    id: 'weightVisibility',
    titleKey: 'accountSettings.preferences.weightVisibility',
    imageSource: require('../assets/icons/weight_visibility.png'),
    type: 'navigation',
    route: ROUTES.WEIGHT_VISIBILITY,
  },
  {
    id: 'onlineVisibility',
    titleKey: 'accountSettings.preferences.onlineVisibility',
    imageSource: require('../assets/icons/online_visibility.png'),
    type: 'segmented',
  },
];

export const APP_SETTINGS = [
  {
    id: 'notificationsEnabled',
    titleKey: 'accountSettings.appSettings.notifications',
    subtitleKey: 'accountSettings.appSettings.notificationsDesc',
    imageSource: require('../assets/icons/unit_icon.png'),
    type: 'switch',
  },
  {
    id: 'videosSoundEnabled',
    titleKey: 'accountSettings.appSettings.videosSound',
    subtitleKey: 'accountSettings.appSettings.videosSoundDesc',
    imageSource: require('../assets/icons/unit_icon.png'),
    type: 'switch',
  },
  {
    id: 'allowSharing',
    titleKey: 'accountSettings.appSettings.allowSharing',
    subtitleKey: 'accountSettings.appSettings.allowSharingDesc',
    imageSource: require('../assets/icons/unit_icon.png'),
    type: 'switch',
  },
];

export const ACCOUNT_ACTIONS = [
  {
    id: 'logout',
    titleKey: 'accountSettings.actions.logout',
    subtitleKey: 'accountSettings.actions.logoutDesc',
    imageSource: require('../assets/icons/logout_black_outline.png'),
    type: 'action',
  },
  {
    id: 'deleteAccount',
    titleKey: 'accountSettings.actions.deleteAccount',
    subtitleKey: 'accountSettings.actions.deleteAccountDesc',
    type: 'action',
    imageSource: require('../assets/icons/delete_account.png'),
    isDestructive: true,
  },
];

export const PROFILE_VISIBILITY_OPTIONS = [
  {
    key: 'Public',
    imageSource: require('../assets/icons/material-symbols_public.png'),
    titleKey: 'accountSettings.visibility.profile.publicTitle',
    descKey: 'accountSettings.visibility.profile.publicDesc',
  },
  {
    key: 'Buddies only',
    imageSource: require('../assets/icons/buddies_only.png'),
    titleKey: 'accountSettings.visibility.profile.buddiesTitle',
    descKey: 'accountSettings.visibility.profile.buddiesDesc',
  },
  {
    key: 'Private',
    imageSource: require('../assets/icons/lock_profile.png'),
    titleKey: 'accountSettings.visibility.profile.privateTitle',
    descKey: 'accountSettings.visibility.profile.privateDesc',
  },
];

export const WEIGHT_VISIBILITY_OPTIONS = [
  {
    key: 'Public',
    imageSource: require('../assets/icons/material-symbols_public.png'),
    titleKey: 'accountSettings.visibility.weight.publicTitle',
    descKey: 'accountSettings.visibility.weight.publicDesc',
  },
  {
    key: 'Buddies only',
    imageSource: require('../assets/icons/buddies_only.png'),
    titleKey: 'accountSettings.visibility.weight.buddiesTitle',
    descKey: 'accountSettings.visibility.weight.buddiesDesc',
  },
  {
    key: 'Only me',
    imageSource: require('../assets/icons/lock_profile.png'),
    titleKey: 'accountSettings.visibility.weight.privateTitle',
    descKey: 'accountSettings.visibility.weight.privateDesc',
  },
];
