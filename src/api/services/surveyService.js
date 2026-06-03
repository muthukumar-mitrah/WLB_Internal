/**
 * Survey service — onboarding survey API calls
 */
import apiClient from '../apiClient';

const surveyService = {
  submitSurvey: payload => apiClient.post('/survey/match', payload),
};

export default surveyService;
