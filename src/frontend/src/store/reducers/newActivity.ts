import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '..'
import { folderType } from '../../api/apis/GetMappingFormFields'

type newActivityType = {
    na_folder: {
        selectedFolder: folderType | null
    }
    uc_folder: {
        selectedFolder: folderType | null
    }
}
const initialState: newActivityType = {
    na_folder: {
        selectedFolder: null,
    },
    uc_folder: {
        selectedFolder: null,
    },
}

const NewActivitySlice = createSlice({
    name: 'newActivity',
    initialState,
    reducers: {
        setNewActivitySelectedFolder: (
            state,
            action: PayloadAction<folderType | null>
        ) => {
            state.na_folder.selectedFolder = action.payload
        },
        setUploadContentSelectedFolder: (
            state,
            action: PayloadAction<folderType | null>
        ) => {
            state.uc_folder.selectedFolder = action.payload
        },
    },
})
export const newActivitySelectedFolderSelector = (
    state: RootState
): folderType | null => state.newActivity.na_folder.selectedFolder

export const uploadContentSelectedFolderSelector = (
    state: RootState
): folderType | null => state.newActivity.uc_folder.selectedFolder

export const { setNewActivitySelectedFolder, setUploadContentSelectedFolder } =
    NewActivitySlice.actions

export default NewActivitySlice.reducer
