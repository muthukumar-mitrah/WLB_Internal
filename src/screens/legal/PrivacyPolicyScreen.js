/**
 * PrivacyPolicyScreen — wrapper that renders the shared LegalContentScreen
 * with Privacy Policy content from i18n translations.
 */
import React, { memo } from 'react';
import LegalContentScreen from './LegalContentScreen';

const PRIVACY_POLICY_SECTIONS = [
    { key: 'plainEnglish' },
    { key: 'informationCollected' },
    { key: 'ipCookiesGifs' },
    { key: 'howInfoUsed' },
    { key: 'operationalProviders' },
    { key: 'advertisersSponsors' },
    { key: 'disclosingInfo' },
    { key: 'limitations' },
    { key: 'deleteData' },
    { key: 'updates' },
];

const PrivacyPolicyScreen = ({ navigation }) => (
    <LegalContentScreen
        navigation={navigation}
        contentKey="privacyPolicy"
        sectionKeys={PRIVACY_POLICY_SECTIONS}
        heroIcon="shield-checkmark"
    />
);

export default memo(PrivacyPolicyScreen);
