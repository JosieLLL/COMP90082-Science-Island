import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '..'
import {
    folderType,
    realmType,
    topicType,
    purposeType,
    ageRangeType,
    keyConceptType,
    scientistType,
    fieldType,
    countryType,
    institutionType,
} from '../../api/apis/GetMappingFormFields'
import { curriculumsType } from '../../api/apis/MapCurriculumAPI'

type mappingType = {
    showDrawer: boolean
    showModal: boolean
    field: string
    folders: {
        selectedFolder: folderType | null
        foldList: folderType[]
    }
    realms: {
        selectedRealm: realmType | null
        realmList: realmType[]
    }
    topics: {
        selectedTopic: topicType | null
        topicList: topicType[]
    }
    keyConcepts: {
        selectedKeyConcept: keyConceptType | null
        keyConceptList: keyConceptType[]
    }
    purposes: {
        selectedPurpose: purposeType | null
        purposeList: purposeType[]
    }
    ageRanges: {
        selectedAgeRange: ageRangeType | null
        ageRangeList: ageRangeType[]
    }
    scientists: {
        selectedScientist: scientistType | null
        scientistList: scientistType[]
    }
    fields: {
        selectedField: fieldType | null
        fieldList: fieldType[]
    }
    institutions: {
        selectedInstitution: institutionType | null
        institutionList: institutionType[]
    }
    countries: {
        selectedCountry: countryType | null
        countryList: countryType[]
    }
    selectedCurriculums: curriculumsType[]
}
const initialState: mappingType = {
    showDrawer: false,
    showModal: false,
    field: '',
    folders: {
        selectedFolder: null,
        foldList: [],
    },
    realms: {
        selectedRealm: null,
        realmList: [],
    },
    topics: {
        selectedTopic: null,
        topicList: [],
    },
    keyConcepts: {
        selectedKeyConcept: null,
        keyConceptList: [],
    },
    purposes: {
        selectedPurpose: null,
        purposeList: [],
    },
    ageRanges: {
        selectedAgeRange: null,
        ageRangeList: [],
    },
    scientists: {
        selectedScientist: null,
        scientistList: [],
    },
    fields: {
        selectedField: null,
        fieldList: [],
    },
    institutions: {
        selectedInstitution: null,
        institutionList: [],
    },
    countries: {
        selectedCountry: null,
        countryList: [],
    },
    selectedCurriculums: [],
}

const MappingSlice = createSlice({
    name: 'mapping',
    initialState,
    reducers: {
        setShowDrawer: (state, action: PayloadAction<boolean>) => {
            state.showDrawer = action.payload
        },
        setShowModal: (state, action: PayloadAction<boolean>) => {
            state.showModal = action.payload
        },
        setField: (state, action: PayloadAction<string>) => {
            state.field = action.payload
        },
        setFolders: (state, action: PayloadAction<folderType[]>) => {
            state.folders.foldList = action.payload
        },
        setSelectedFolder: (
            state,
            action: PayloadAction<folderType | null>
        ) => {
            state.folders.selectedFolder = action.payload
        },
        setRealms: (state, action: PayloadAction<realmType[]>) => {
            state.realms.realmList = action.payload
        },
        setSelectedRealm: (state, action: PayloadAction<realmType | null>) => {
            state.realms.selectedRealm = action.payload
        },
        setTopics: (state, action: PayloadAction<topicType[]>) => {
            state.topics.topicList = action.payload
        },
        setSelectedTopic: (state, action: PayloadAction<topicType | null>) => {
            state.topics.selectedTopic = action.payload
        },
        setKeyConcepts: (state, action: PayloadAction<keyConceptType[]>) => {
            state.keyConcepts.keyConceptList = action.payload
        },
        setSelectedKeyConcept: (
            state,
            action: PayloadAction<keyConceptType | null>
        ) => {
            state.keyConcepts.selectedKeyConcept = action.payload
        },
        setPurposes: (state, action: PayloadAction<purposeType[]>) => {
            state.purposes.purposeList = action.payload
        },
        setSelectedPurpose: (
            state,
            action: PayloadAction<purposeType | null>
        ) => {
            state.purposes.selectedPurpose = action.payload
        },
        setAgeRanges: (state, action: PayloadAction<ageRangeType[]>) => {
            state.ageRanges.ageRangeList = action.payload
        },
        setSelectedAgeRange: (
            state,
            action: PayloadAction<ageRangeType | null>
        ) => {
            state.ageRanges.selectedAgeRange = action.payload
        },
        setScientists: (state, action: PayloadAction<scientistType[]>) => {
            state.scientists.scientistList = action.payload
        },
        setSelectedScientist: (
            state,
            action: PayloadAction<scientistType | null>
        ) => {
            state.scientists.selectedScientist = action.payload
        },
        setFields: (state, action: PayloadAction<fieldType[]>) => {
            state.fields.fieldList = action.payload
        },
        setSelectedField: (state, action: PayloadAction<fieldType | null>) => {
            state.fields.selectedField = action.payload
        },
        setInstitutions: (state, action: PayloadAction<institutionType[]>) => {
            state.institutions.institutionList = action.payload
        },
        setSelectedInstitution: (
            state,
            action: PayloadAction<institutionType | null>
        ) => {
            state.institutions.selectedInstitution = action.payload
        },
        setCountries: (state, action: PayloadAction<countryType[]>) => {
            state.countries.countryList = action.payload
        },
        setSelectedCountry: (
            state,
            action: PayloadAction<countryType | null>
        ) => {
            state.countries.selectedCountry = action.payload
        },
        setSelectedCurriculums: (
            state,
            action: PayloadAction<curriculumsType[]>
        ) => {
            state.selectedCurriculums = action.payload
        },
    },
})

export const showDrawerSelector = (state: RootState): boolean =>
    state.mapping.showDrawer
export const showModalSelector = (state: RootState): boolean =>
    state.mapping.showModal

export const fieldSelector = (state: RootState): string => state.mapping.field

export const folderSelector = (state: RootState): folderType[] =>
    state.mapping.folders.foldList
export const selectedFolderSelector = (state: RootState): folderType | null =>
    state.mapping.folders.selectedFolder

export const realmSelector = (state: RootState): realmType[] =>
    state.mapping.realms.realmList
export const selectedRealmSelector = (state: RootState): realmType | null =>
    state.mapping.realms.selectedRealm

export const topicSelector = (state: RootState): topicType[] =>
    state.mapping.topics.topicList
export const selectedTopicSelector = (state: RootState): topicType | null =>
    state.mapping.topics.selectedTopic

export const purposeSelector = (state: RootState): purposeType[] =>
    state.mapping.purposes.purposeList
export const selectedPurposeSelector = (state: RootState): purposeType | null =>
    state.mapping.purposes.selectedPurpose

export const ageRangeSelector = (state: RootState): ageRangeType[] =>
    state.mapping.ageRanges.ageRangeList
export const selectedAgeRangeSelector = (
    state: RootState
): ageRangeType | null => state.mapping.ageRanges.selectedAgeRange

export const keyConceptsSelector = (state: RootState): keyConceptType[] =>
    state.mapping.keyConcepts.keyConceptList
export const selectedKeyConceptSelector = (
    state: RootState
): keyConceptType | null => state.mapping.keyConcepts.selectedKeyConcept

export const scientistsSelector = (state: RootState): scientistType[] =>
    state.mapping.scientists.scientistList
export const selectedScientistSelector = (
    state: RootState
): scientistType | null => state.mapping.scientists.selectedScientist
export const fieldsSelector = (state: RootState): fieldType[] =>
    state.mapping.fields.fieldList
export const selectedFieldSelector = (state: RootState): fieldType | null =>
    state.mapping.fields.selectedField
export const institutionsSelector = (state: RootState): institutionType[] =>
    state.mapping.institutions.institutionList
export const selectedInstitutionSelector = (
    state: RootState
): institutionType | null => state.mapping.institutions.selectedInstitution
export const countriesSelector = (state: RootState): countryType[] =>
    state.mapping.countries.countryList
export const selectedCountrySelector = (state: RootState): countryType | null =>
    state.mapping.countries.selectedCountry
export const selectedCurriculumsSelector = (
    state: RootState
): curriculumsType[] => state.mapping.selectedCurriculums
export const {
    setShowDrawer,
    setShowModal,
    setField,
    setFolders,
    setSelectedFolder,
    setRealms,
    setSelectedRealm,
    setTopics,
    setSelectedTopic,
    setAgeRanges,
    setSelectedAgeRange,
    setPurposes,
    setSelectedPurpose,
    setKeyConcepts,
    setSelectedKeyConcept,
    setCountries,
    setSelectedCountry,
    setFields,
    setSelectedField,
    setInstitutions,
    setSelectedInstitution,
    setScientists,
    setSelectedScientist,
    setSelectedCurriculums,
} = MappingSlice.actions

export default MappingSlice.reducer
