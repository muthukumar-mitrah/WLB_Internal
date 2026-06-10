/**
 * SurveyContext — stores all survey question answers during the onboarding flow.
 * Each survey screen reads and writes to this context.
 * Call resetSurvey() to clear state (e.g. on logout).
 */
import React, { createContext, useContext, useReducer, useCallback } from 'react';

// ─── Initial State ────────────────────────────────────────────────────────────
const initialSurveyState = {
  mainGoal: null,
  poundsToLose: null,
  commitmentLevel: null,

};

// ─── Actions ─────────────────────────────────────────────────────────────────
const SURVEY_ACTIONS = {
  SET_ANSWER: 'SET_ANSWER',
  RESET: 'RESET',
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
const surveyReducer = (state, action) => {
  switch(action.type) {
    case SURVEY_ACTIONS.SET_ANSWER:
      return { ...state, [action.key]: action.value };
    case SURVEY_ACTIONS.RESET:
      return { ...initialSurveyState };
    default:
      return state;
  }
};

// ─── Context ──────────────────────────────────────────────────────────────────
const SurveyContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const SurveyProvider = ({ children }) => {
  const [surveyData, dispatch] = useReducer(surveyReducer, initialSurveyState);

  const setSurveyAnswer = useCallback((key, value) => {
    dispatch({ type: SURVEY_ACTIONS.SET_ANSWER, key, value });
  }, []);

  const resetSurvey = useCallback(() => {
    dispatch({ type: SURVEY_ACTIONS.RESET });
  }, []);

  return (
    <SurveyContext.Provider value={{ surveyData, setSurveyAnswer, resetSurvey }}>
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const ctx = useContext(SurveyContext);
  if(!ctx) {
    throw new Error('useSurvey must be used inside <SurveyProvider>');
  }
  return ctx;
};

export default SurveyContext;
