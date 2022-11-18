import { combineReducers } from '@reduxjs/toolkit'
import userSlice from './user'
import activityPoolSlice from './activityPool'
import mappingSlice from './mapping'
import newActivitySlice from './newActivity'

const rootReducers = combineReducers({
    user: userSlice,
    activityPool: activityPoolSlice,
    mapping: mappingSlice,
    newActivity: newActivitySlice,
})

export default rootReducers
