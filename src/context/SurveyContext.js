/**
 * SurveyContext — stores all survey question answers during the onboarding flow.
 * Each survey screen reads and writes to this context.
 * Call resetSurvey() to clear state (e.g. on logout).
 */
import React, { createContext, useContext, useReducer, useCallback } from 'react';

// ─── Initial State ────────────────────────────────────────────────────────────
// Add a key per survey question as you build each screen.
const initialSurveyState = {
  // Q1 — What's your main goal right now?
  mainGoal: null,

  // Q2 — How many pounds do you want to lose?
  poundsToLose: null,

  // Q3 — How committed are you right now?
  commitmentLevel: null,

  // Q4 – Q10+ placeholders (populate as screens are built)
  // activityLevel: null,
  // dietPreference: null,
  // ... etc.
};

// ─── Actions ─────────────────────────────────────────────────────────────────
const SURVEY_ACTIONS = {
  SET_ANSWER: 'SET_ANSWER',
  RESET: 'RESET',
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
const surveyReducer = (state, action) => {
  switch (action.type) {
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

  /**
   * Set a single survey answer.
   * @param {string} key   - Field name matching initialSurveyState (e.g. 'mainGoal')
   * @param {*}      value - The selected value
   */
  const setSurveyAnswer = useCallback((key, value) => {
    dispatch({ type: SURVEY_ACTIONS.SET_ANSWER, key, value });
  }, []);

  /** Reset all survey answers (e.g. on logout or restart) */
  const resetSurvey = useCallback(() => {
    dispatch({ type: SURVEY_ACTIONS.RESET });
  }, []);

  return (
    <SurveyContext.Provider value={{ surveyData, setSurveyAnswer, resetSurvey }}>
      {children}
    </SurveyContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useSurvey = () => {
  const ctx = useContext(SurveyContext);
  if (!ctx) {
    throw new Error('useSurvey must be used inside <SurveyProvider>');
  }
  return ctx;
};

export default SurveyContext;
