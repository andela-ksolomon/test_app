import {
    FETCH_FORM,
    UPDATE_STATS
} from '../actions/types';

const initialState = {
	forms: null,
	stats: null
};

export function form (state = initialState, action) {
    switch(action.type) {
        case FETCH_FORM:
          return Object.assign({}, state, {
            forms: {...action.forms}
          });
        case UPDATE_STATS:
          return Object.assign({}, state, {
            stats: {...action.stats}
          });
        default:
          return state
    }
}
