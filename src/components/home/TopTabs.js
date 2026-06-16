import { StyleSheet, TouchableOpacity, View } from "react-native";
import { AppText } from "../common";
import { fontFamily } from "../../theme/fonts";
import { t } from "i18next";

const TopTabs = ({ activeTab, setActiveTab, colors }) => {

    const TABS = [
        { key: 'trending', labelKey: 'home.topTabs.trending' },
        { key: 'wlb', labelKey: 'home.topTabs.wlb' },
        { key: 'buddies', labelKey: 'home.topTabs.buddies' },
        { key: 'groups', labelKey: 'home.topTabs.groups' },
    ];

    return (
        <View style={[styles.tabStrip, { backgroundColor: colors.background }]}>
            <View
                style={[styles.tabStripContent, { backgroundColor: colors.primarySurface }]}
            >
                {TABS.map(tab => {
                    const isActive = activeTab === tab.key;
                    return (
                        <TouchableOpacity
                            key={tab.key}
                            style={[
                                styles.tab,
                                isActive
                                    ? [
                                        styles.tabActive,
                                        {
                                            backgroundColor: colors.background,
                                            borderColor: colors.isDark ? colors.border : '#B3BEFB',
                                            shadowColor: colors.primary,
                                        },

                                    ]
                                    : null,
                            ]}
                            activeOpacity={0.7}
                            onPress={() => setActiveTab(tab.key)}
                        >
                            <AppText
                                style={[
                                    styles.tabLabel,
                                    isActive
                                        ? { color: colors.primary, fontFamily: fontFamily.medium }
                                        : { color: colors.textSecondary, fontFamily: fontFamily.medium },
                                ]}
                            >
                                {t(tab.labelKey)}
                            </AppText>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    tabStrip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    tabStripContent: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 3,
        paddingVertical: 3,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabActive: {
        borderWidth: 1,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
    },
    tabLabel: {
        fontFamily: fontFamily.semiBold,
        fontSize: 14,
    },
})

export default TopTabs;