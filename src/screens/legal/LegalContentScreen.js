/**
 * LegalContentScreen — shared, reusable screen for rendering legal documents
 * (Terms of Use, Privacy Policy, etc.) in a professional, theme-aware layout.
 */
import React, { memo, useMemo, useCallback, useRef } from 'react';
import { Animated, Platform, StyleSheet, View, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import { AppText, Header, SafeContainer } from '../../components/common';
import { useTranslation } from '../../i18n/useTranslation';

const SectionBadge = memo(({ index, colors, borderRadius }) => (
    <View
        style={[
            sectionBadgeStyles.badge,
            {
                backgroundColor: colors.primarySurface,
                borderRadius: borderRadius.full,
            },
        ]}>
        <AppText variant="captionMedium" color={colors.primary}>
            {String(index + 1).padStart(2, '0')}
        </AppText>
    </View>
));

const sectionBadgeStyles = StyleSheet.create({
    badge: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const BulletItem = memo(({ text, colors, spacing }) => (
    <View style={[bulletStyles.row, { paddingLeft: spacing[4] }]}>
        <View
            style={[
                bulletStyles.dot,
                { backgroundColor: colors.primary, marginTop: 8, marginRight: spacing[2] },
            ]}
        />
        <AppText variant="body" color={colors.textSecondary} style={{ flex: 1 }}>
            {text}
        </AppText>
    </View>
));

const bulletStyles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
});

const ContentSection = memo(
    ({ heading, body, bullets, uppercase, index, colors, spacing, borderRadius, shadows }) => (
        <View
            style={[
                sectionStyles.card,
                {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.cardBorder,
                    borderRadius: borderRadius.lg,
                    padding: spacing[4],
                    marginBottom: spacing[3],
                },
                shadows.card,
            ]}>
            <View style={sectionStyles.headerRow}>
                <SectionBadge index={index} colors={colors} borderRadius={borderRadius} />
                <AppText
                    variant="title"
                    color={colors.textPrimary}
                    style={{ flex: 1, marginLeft: spacing[3] }}>
                    {heading}
                </AppText>
            </View>
            <View
                style={[
                    sectionStyles.divider,
                    { backgroundColor: colors.divider, marginVertical: spacing[3] },
                ]}
            />
            {body &&
                body.map((paragraph, pIdx) => (
                    <AppText
                        key={`p-${pIdx}`}
                        variant="body"
                        color={colors.textSecondary}
                        style={[
                            {
                                lineHeight: 22,
                                marginBottom: pIdx < body.length - 1 ? spacing[3] : 0,
                            },
                            uppercase && { fontSize: 11, lineHeight: 18, letterSpacing: 0.3 },
                        ]}>
                        {paragraph}
                    </AppText>
                ))}
            {bullets && bullets.length > 0 && (
                <View style={{ marginTop: spacing[3] }}>
                    {bullets.map((bullet, bIdx) => (
                        <BulletItem
                            key={`b-${bIdx}`}
                            text={bullet}
                            colors={colors}
                            spacing={spacing}
                        />
                    ))}
                </View>
            )}
        </View>
    ),
);

const sectionStyles = StyleSheet.create({
    card: {
        borderWidth: 1,
        overflow: 'hidden',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    divider: {
        height: 1,
    },
});

const LegalContentScreen = ({ navigation, contentKey, sectionKeys, heroIcon }) => {
    const { colors, spacing, borderRadius, shadows } = useTheme();
    const { t } = useTranslation();
    const scrollY = useRef(new Animated.Value(0)).current;

    const title = t(`legal.${contentKey}.title`);
    const heroSubtitle = t(`legal.${contentKey}.heroSubtitle`);
    const effectiveDate = t('legal.effectiveDate');
    const footerCopyright = t('legal.copyright', { year: new Date().getFullYear() });
    const footerContact = t(`legal.${contentKey}.footerContact`);

    const sections = useMemo(
        () =>
            sectionKeys.map((config) => {
                const data = t(`legal.${contentKey}.sections.${config.key}`, {
                    returnObjects: true,
                });
                return { ...data, ...config };
            }),
        [t, contentKey, sectionKeys],
    );

    const styles = useMemo(
        () => createStyles({ colors, spacing, borderRadius, shadows }),
        [colors, spacing, borderRadius, shadows],
    );

    const handleBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    // Header border opacity driven by scroll
    const headerBorderOpacity = scrollY.interpolate({
        inputRange: [0, 30],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    return (
        <SafeContainer
            edges={['top', 'bottom']}
            backgroundColor={colors.backgroundSecondary}
            scroll={false}>
            <StatusBar
                barStyle={colors.statusBar}
                backgroundColor={colors.background}
                translucent={false}
            />
            <View style={styles.screen}>
                <View style={styles.headerWrapper}>
                    <Header
                        title={title}
                        showBack
                        onBackPress={handleBack}
                        style={styles.header}
                    />
                    <Animated.View
                        style={[
                            styles.headerBorder,
                            { backgroundColor: colors.divider, opacity: headerBorderOpacity },
                        ]}
                    />
                </View>
                <Animated.ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: false },
                    )}
                    scrollEventThrottle={16}>
                    <View style={styles.heroSection}>
                        <View style={styles.heroIconWrapper}>
                            <Icon name={heroIcon} size={28} color={colors.primary} />
                        </View>
                        <AppText variant="h2" color={colors.textPrimary} style={styles.heroTitle}>
                            {title}
                        </AppText>
                        <AppText
                            variant="body"
                            color={colors.textSecondary}
                            style={styles.heroSubtitle}>
                            {heroSubtitle}
                        </AppText>
                        <View
                            style={[
                                styles.dateBadge,
                                {
                                    backgroundColor: colors.primarySurface,
                                    borderColor: colors.primary + '20',
                                },
                            ]}>
                            <Icon
                                name="time-outline"
                                size={14}
                                color={colors.primary}
                                style={{ marginRight: 6 }}
                            />
                            <AppText variant="captionMedium" color={colors.primary}>
                                {effectiveDate}
                            </AppText>
                        </View>
                    </View>
                    {sections.map((section, idx) => (
                        <ContentSection
                            key={section.key}
                            heading={section.heading}
                            body={section.body}
                            bullets={section.bullets}
                            uppercase={section.uppercase}
                            index={idx}
                            colors={colors}
                            spacing={spacing}
                            borderRadius={borderRadius}
                            shadows={shadows}
                        />
                    ))}
                    <View style={styles.footer}>
                        <View style={[styles.footerDivider, { backgroundColor: colors.divider }]} />
                        <AppText
                            variant="caption"
                            color={colors.textTertiary}
                            style={styles.footerText}>
                            {footerCopyright}
                        </AppText>
                        <AppText
                            variant="caption"
                            color={colors.textTertiary}
                            style={styles.footerSubtext}>
                            {footerContact}
                        </AppText>
                    </View>
                </Animated.ScrollView>
            </View>
        </SafeContainer>

    );
};

const createStyles = ({ colors, spacing, borderRadius, shadows }) =>
    StyleSheet.create({
        screen: {
            flex: 1,
            backgroundColor: colors.background,
        },
        headerWrapper: {
            backgroundColor: colors.background,
            zIndex: 10,
            paddingTop: Platform.OS === 'ios' ? 50 : 0,
        },
        header: {
            ...shadows.none,
        },
        headerBorder: {
            height: 1,
            width: '100%',
        },
        scrollContent: {
            paddingHorizontal: spacing[4],
            paddingBottom: spacing[10],
        },
        // Hero
        heroSection: {
            alignItems: 'center',
            paddingTop: spacing[6],
            paddingBottom: spacing[6],
            marginBottom: spacing[2],
        },
        heroIconWrapper: {
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.primarySurface,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing[4],
        },
        heroTitle: {
            textAlign: 'center',
            marginBottom: spacing[2],
        },
        heroSubtitle: {
            textAlign: 'center',
            lineHeight: 22,
            paddingHorizontal: spacing[2],
            marginBottom: spacing[3],
        },
        dateBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: spacing[1.5],
            paddingHorizontal: spacing[3],
            borderRadius: borderRadius.full,
            borderWidth: 1,
        },
        // Footer
        footer: {
            alignItems: 'center',
            paddingTop: spacing[6],
            paddingBottom: spacing[4],
        },
        footerDivider: {
            height: 1,
            width: 80,
            marginBottom: spacing[4],
        },
        footerText: {
            textAlign: 'center',
            marginBottom: spacing[1],
        },
        footerSubtext: {
            textAlign: 'center',
        },
    });

export default memo(LegalContentScreen);
