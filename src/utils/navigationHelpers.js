import { ROUTES } from '../constants';

/**
 * Safely handles drawer closing, nested navigation to the Home screen,
 * switching to the WLB tab, and setting the pending tour start flag.
 *
 * @param {object} navigation - React Navigation navigation object
 * @param {function} setActiveTab - Feed context tab controller
 * @param {function} setPendingTourStart - Tour context pending startup flag setter
 */
export const openTour = (navigation, setActiveTab, setPendingTourStart) => {
  // Navigation Guard: Validate state exists to avoid dispatching invalid routes
  if (!navigation || typeof navigation.getState !== 'function' || !navigation.getState()) {
    return;
  }

  // 1. Close drawer
  navigation.closeDrawer();

  // 2. Set pendingTourStart flag to true
  if (typeof setPendingTourStart === 'function') {
    setPendingTourStart(true);
  }

  // 3. Navigate nestedly to the home screen
  navigation.navigate(ROUTES.HOME_TABS, {
    screen: ROUTES.HOME,
  });

  // 4. Switch active tab in feed to WLB
  if (typeof setActiveTab === 'function') {
    setActiveTab('wlb');
  }
};
