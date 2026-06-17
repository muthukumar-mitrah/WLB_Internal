/**
 * BlockedUsersScreen — colocated styles
 */
import { StyleSheet } from 'react-native';

export const createStyles = ({ colors, spacing }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // ── Header ──────────────────────────────────────────────────────────
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    backBtn: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing[2],
    },

    // ── User list ───────────────────────────────────────────────────────
    listContent: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[1],
      paddingBottom: spacing[6],
    },
    userRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing[3],
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primarySoft,
    },
    userInfo: {
      flex: 1,
      marginLeft: spacing[3],
    },
    blockedDate: {
      marginTop: -1,
      lineHeight: 14,
    },

    // ── Unblock modal ───────────────────────────────────────────────────
    modalCloseButton: {
      alignSelf: 'flex-end',
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.backgroundSecondary,
      marginTop: spacing[3],
    },
    modalBody: {
      alignItems: 'center',
      paddingTop: spacing[2],
    },
    modalAvatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      marginBottom: spacing[3],
      backgroundColor: colors.primarySoft,
    },
    modalTitle: {
      textAlign: 'center',
      marginBottom: spacing[2],
    },
    modalDescription: {
      textAlign: 'center',
      marginBottom: spacing[5],
      paddingHorizontal: spacing[2],
    },
    modalButtons: {
      flexDirection: 'row',
      width: '100%',
    },
    modalButtonCancel: {
      flex: 1,
      marginRight: spacing[2],
    },
    modalButtonConfirm: {
      flex: 1,
      marginLeft: spacing[2],
    },
  });
