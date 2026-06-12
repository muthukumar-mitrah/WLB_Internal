/**
 * TermsOfUseScreen — wrapper that renders the shared LegalContentScreen
 * with Terms of Use content from i18n translations.
 */
import React, { memo } from 'react';
import LegalContentScreen from './LegalContentScreen';

const TERMS_OF_USE_SECTIONS = [
    { key: 'agreement' },
    { key: 'modifications' },
    { key: 'changesToTerms' },
    { key: 'useOfMaterials' },
    { key: 'healthDisclaimer' },
    { key: 'onlineConduct' },
    { key: 'interactiveAreas' },
    { key: 'passwords' },
    { key: 'parentalPermission' },
    { key: 'links' },
    { key: 'choiceOfLaw' },
    { key: 'limitationOfLiability' },
    { key: 'disclaimers', uppercase: true },
];

const TermsOfUseScreen = ({ navigation }) => (
    <LegalContentScreen
        navigation={navigation}
        contentKey="termsOfUse"
        sectionKeys={TERMS_OF_USE_SECTIONS}
        heroIcon="document-text"
    />
);

export default memo(TermsOfUseScreen);
