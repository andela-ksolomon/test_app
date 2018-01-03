import {
    FETCH_FORM
} from '../actions/types';

const initialState = {
	forms: null
};

export function form (state = initialState, action) {
    switch(action.type) {
        case FETCH_FORM:
          return Object.assign({}, state, {
            forms: {...action.forms}
          });
        default:
          return state
    }
}
