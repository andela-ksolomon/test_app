import {
    FETCH_FORM
} from './types';
export function fetchForm (forms) {
    return {
        type: FETCH_FORM,
        forms
    }
}