import { StyleSheet, Platform } from "react-native";
import { fontFamily } from "../../../theme/fonts";

const styles = StyleSheet.create({
    card: {
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardAuthorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    avatarText: {
        color: '#FFFFFF',
        fontFamily: fontFamily.bold,
    },
    cardHeaderInfo: {
        flex: 1,
    },
    cardUsername: {
        fontFamily: fontFamily.semiBold,
        fontSize: 14,
        lineHeight: 18,
    },
    cardMeta: {
        fontFamily: fontFamily.regular,
        fontSize: 12,
        marginTop: 1,
    },
    cardHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    chatBtn: {
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderRadius: 20,
    },
    chatBtnLabel: {
        color: '#FFFFFF',
        fontFamily: fontFamily.semiBold,
        fontSize: 13,
    },
    menuBtn: {
        padding: 2,
    },
    cardText: {
        fontFamily: fontFamily.regular,
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 10,
    },
    postContentContainer: {
        position: 'relative',
        width: '100%',
    },
    textPressable: {
        width: '100%',
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 10,
    },
    imagePressable: {
        width: '100%',
    },
    postImage: {
        width: '100%',
        height: 220,
        borderRadius: 12,
    },
    dimOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 12,
        zIndex: 9,
        elevation: 4,
    },
    overlayContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        elevation: 5,
    },
    lottieOverlay: {
        width: 160,
        height: 160,
    },
    previewBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    previewContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewCloseBtn: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    previewImage: {
        width: '100%',
        height: '80%',
    },
    reactionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 4,
    },
    reactionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
        gap: 4,
    },
    reactionCount: {
        fontFamily: fontFamily.medium,
        fontSize: 13,
    },
})

export default styles;