import {
    FETCH_FORM,
    UPDATE_STATS
} from './types';
export function fetchForm (forms) {
    return {
        type: FETCH_FORM,
        forms
    }
}

export function updateStats (totalUserTests, totalTests) {
    return {
        type: UPDATE_STATS,
        stats: {
          totalUserTests,
          totalTests
        }
    }
}