import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { activityTypes } from '../../api/apis/GetActivityPoolAPI'
import { RootState } from '..'
import {
    LEARNING_AREA,
    QUEST_TYPE,
    GENERAL_CAPABILITY,
} from '../../utils/constants'

type filterCategoryType = {
    name: 'Status' | 'Quest Type' | 'Learning Area' | 'General Capability'
    categories: string[]
    checkedList: string[]
    checkAll: boolean
    indeterminate: boolean
}

export enum filterKey {
    // eslint-disable-next-line no-unused-vars
    status = 'status',
    // eslint-disable-next-line no-unused-vars
    questTypes = 'questTypes',
    // eslint-disable-next-line no-unused-vars
    learningAreas = 'learningAreas',
    // eslint-disable-next-line no-unused-vars
    generalCapabilities = 'generalCapabilities',
}

export type poolType = {
    totalNum: number
    pageSize: number
    page: number
    activityPool: activityTypes[]
    filters: Record<keyof typeof filterKey, filterCategoryType>
    folders: number[]
}

const initialState: poolType = {
    totalNum: 0,
    page: 1,
    pageSize: 6,
    activityPool: [],
    filters: {
        [filterKey.status]: {
            name: 'Status',
            categories: ['Mapped', 'Unmapped'],
            checkedList: [],
            checkAll: false,
            indeterminate: false,
        },
        [filterKey.questTypes]: {
            name: 'Quest Type',
            categories: QUEST_TYPE.map((item) => item.name),
            checkedList: [],
            checkAll: false,
            indeterminate: false,
        },
        [filterKey.learningAreas]: {
            name: 'Learning Area',
            categories: LEARNING_AREA.map((item) => item.name),
            checkedList: [],
            checkAll: false,
            indeterminate: false,
        },
        [filterKey.generalCapabilities]: {
            name: 'General Capability',
            categories: GENERAL_CAPABILITY.map((item) => item.name),
            checkedList: [],
            checkAll: false,
            indeterminate: false,
        },
    },
    folders: [],
}
const ActivityPoolSlice = createSlice({
    name: 'activityPool',
    initialState,
    reducers: {
        setFolders: (state, action: PayloadAction<number[]>) => {
            state.folders = action.payload
        },
        setActivityPool: (
            state,
            action: PayloadAction<poolType['activityPool']>
        ) => {
            state.activityPool = action.payload
        },

        setTotalNum: (state, action: PayloadAction<poolType['totalNum']>) => {
            state.totalNum = action.payload
        },

        setPage: (state, action: PayloadAction<poolType['page']>) => {
            state.page = action.payload
        },

        setPageSize: (state, action: PayloadAction<poolType['pageSize']>) => {
            state.pageSize = action.payload
        },

        setCheckedList: (
            state,
            action: PayloadAction<{
                label:
                    | 'status'
                    | 'questTypes'
                    | 'learningAreas'
                    | 'generalCapabilities'
                checkList: string[]
            }>
        ) => {
            state.filters[action.payload.label].checkedList =
                action.payload.checkList
        },

        setSelectAll: (
            state,
            action: PayloadAction<{
                label:
                    | 'status'
                    | 'questTypes'
                    | 'learningAreas'
                    | 'generalCapabilities'
                selectAll: boolean
            }>
        ) => {
            state.filters[action.payload.label].checkAll =
                action.payload.selectAll
        },

        setIndeterminate: (
            state,
            action: PayloadAction<{
                label:
                    | 'status'
                    | 'questTypes'
                    | 'learningAreas'
                    | 'generalCapabilities'
                indeterminate: boolean
            }>
        ) => {
            state.filters[action.payload.label].indeterminate =
                action.payload.indeterminate
        },
    },
})

export const {
    setActivityPool,
    setPageSize,
    setPage,
    setTotalNum,
    setCheckedList,
    setSelectAll,
    setIndeterminate,
    setFolders,
} = ActivityPoolSlice.actions
export const activityPoolFoldersSelector = (state: RootState): number[] =>
    state.activityPool.folders
export const activityPoolSelector = (state: RootState): activityTypes[] =>
    state.activityPool.activityPool
export const pageSelector = (state: RootState): poolType['page'] =>
    state.activityPool.page
export const pageSizeSelector = (state: RootState): poolType['pageSize'] =>
    state.activityPool.pageSize
export const totalNumSelector = (state: RootState): poolType['totalNum'] =>
    state.activityPool.totalNum
export const filtersSelector = (state: RootState): poolType['filters'] =>
    state.activityPool.filters
export default ActivityPoolSlice.reducer
