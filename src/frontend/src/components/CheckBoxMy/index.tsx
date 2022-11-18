import React, { useEffect } from 'react'
import { Checkbox, Divider, Select } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import './index.scss'
import {
    setCheckedList,
    setSelectAll,
    setIndeterminate,
    filtersSelector,
    setActivityPool,
    setTotalNum,
    setPage,
    pageSizeSelector,
    setFolders,
    activityPoolFoldersSelector,
} from '../../store/reducers/activityPool'
import { GetActivityPoolApi } from '../../api/apis/GetActivityPoolAPI'
import { filterParams } from '../../utils/helper'
import { folderSelector } from '../../store/reducers/mapping'

const { Option } = Select

const CheckBoxMy = (): JSX.Element => {
    const dispatch = useDispatch()
    const filter = useSelector(filtersSelector)
    const size = useSelector(pageSizeSelector)
    const folders = useSelector(folderSelector)
    const selectedFilterFolders = useSelector(activityPoolFoldersSelector)
    const CheckboxGroup = Checkbox.Group
    const filterGetActivity = (): void => {
        const ftParams = {
            folderIds: selectedFilterFolders.join(','),
            ...filterParams(filter),
            page: 1,
            pageLimit: size,
        }
        GetActivityPoolApi(ftParams).then((res) => {
            dispatch(setActivityPool(res.Data.Activities))
            dispatch(setTotalNum(res.Data.TotalNum))
            dispatch(setPage(1))
        })
    }
    const onChangeFolder = (value: number[]): void => {
        dispatch(setFolders(value))
    }
    useEffect(() => {
        filterGetActivity()
    }, [filter, selectedFilterFolders])
    const onChangeStatus = (list: any[]): void => {
        dispatch(setCheckedList({ label: 'status', checkList: list }))
        dispatch(
            setIndeterminate({
                label: 'status',
                indeterminate:
                    !!list.length &&
                    list.length < filter.status.categories.length,
            })
        )
        dispatch(
            setSelectAll({
                label: 'status',
                selectAll: list.length === filter.status.categories.length,
            })
        )
    }
    const onCheckAllChangeStatus = (e: any): void => {
        dispatch(
            setCheckedList({
                label: 'status',
                checkList: e.target.checked ? filter.status.categories : [],
            })
        )
        dispatch(
            setIndeterminate({
                label: 'status',
                indeterminate: false,
            })
        )
        dispatch(setSelectAll({ label: 'status', selectAll: e.target.checked }))
    }

    const onChangeQuestType = (list: any[]): void => {
        dispatch(setCheckedList({ label: 'questTypes', checkList: list }))
        dispatch(
            setIndeterminate({
                label: 'questTypes',
                indeterminate:
                    !!list.length &&
                    list.length < filter.questTypes.categories.length,
            })
        )
        dispatch(
            setSelectAll({
                label: 'questTypes',
                selectAll: list.length === filter.questTypes.categories.length,
            })
        )
    }
    const onCheckAllChangeQuestType = (e: any): void => {
        dispatch(
            setCheckedList({
                label: 'questTypes',
                checkList: e.target.checked ? filter.questTypes.categories : [],
            })
        )
        dispatch(
            setIndeterminate({
                label: 'questTypes',
                indeterminate: false,
            })
        )
        dispatch(
            setSelectAll({ label: 'questTypes', selectAll: e.target.checked })
        )
    }

    const onChangeLearningArea = (list: any[]): void => {
        dispatch(setCheckedList({ label: 'learningAreas', checkList: list }))
        dispatch(
            setIndeterminate({
                label: 'learningAreas',
                indeterminate:
                    !!list.length &&
                    list.length < filter.learningAreas.categories.length,
            })
        )
        dispatch(
            setSelectAll({
                label: 'learningAreas',
                selectAll:
                    list.length === filter.learningAreas.categories.length,
            })
        )
    }
    const onCheckAllChangeLearningArea = (e: any): void => {
        dispatch(
            setCheckedList({
                label: 'learningAreas',
                checkList: e.target.checked
                    ? filter.learningAreas.categories
                    : [],
            })
        )
        dispatch(
            setIndeterminate({
                label: 'learningAreas',
                indeterminate: false,
            })
        )
        dispatch(
            setSelectAll({
                label: 'learningAreas',
                selectAll: e.target.checked,
            })
        )
    }

    const onChangeGeneralCapability = (list: any[]): void => {
        dispatch(
            setCheckedList({ label: 'generalCapabilities', checkList: list })
        )
        dispatch(
            setIndeterminate({
                label: 'generalCapabilities',
                indeterminate:
                    !!list.length &&
                    list.length < filter.generalCapabilities.categories.length,
            })
        )
        dispatch(
            setSelectAll({
                label: 'generalCapabilities',
                selectAll:
                    list.length ===
                    filter.generalCapabilities.categories.length,
            })
        )
    }
    const onCheckAllChangeGeneralCapability = (e: any): void => {
        dispatch(
            setCheckedList({
                label: 'generalCapabilities',
                checkList: e.target.checked
                    ? filter.generalCapabilities.categories
                    : [],
            })
        )
        dispatch(
            setIndeterminate({
                label: 'generalCapabilities',
                indeterminate: false,
            })
        )
        dispatch(
            setSelectAll({
                label: 'generalCapabilities',
                selectAll: e.target.checked,
            })
        )
    }
    return (
        <div className="checkBoxWrap thin-scroll-bar">
            <Select
                placeholder="Filter by folders"
                onChange={onChangeFolder}
                mode="multiple"
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
            >
                {folders &&
                    folders.map((item) => (
                        <Option key={item.FolderID} value={item.FolderID}>
                            {item.FolderName}
                        </Option>
                    ))}
            </Select>
            <div className="checkbox-container-wrapper">
                <div className="checkbox-container">
                    <p className="filter-type fw_bold">{filter.status.name}</p>
                    <Checkbox
                        indeterminate={filter.status.indeterminate}
                        onChange={onCheckAllChangeStatus}
                        checked={filter.status.checkAll}
                    >
                        Check all
                    </Checkbox>
                    <Divider />
                    <CheckboxGroup
                        name="status"
                        options={filter.status.categories}
                        value={filter.status.checkedList}
                        onChange={onChangeStatus}
                    />
                </div>
                <div className="checkbox-container">
                    <p className="filter-type fw_bold">
                        {filter.questTypes.name}
                    </p>
                    <Checkbox
                        indeterminate={filter.questTypes.indeterminate}
                        onChange={onCheckAllChangeQuestType}
                        checked={filter.questTypes.checkAll}
                    >
                        Check all
                    </Checkbox>
                    <Divider />
                    <CheckboxGroup
                        name="status"
                        options={filter.questTypes.categories}
                        value={filter.questTypes.checkedList}
                        onChange={onChangeQuestType}
                    />
                </div>
                <div className="checkbox-container">
                    <p className="filter-type fw_bold">
                        {filter.learningAreas.name}
                    </p>
                    <Checkbox
                        indeterminate={filter.learningAreas.indeterminate}
                        onChange={onCheckAllChangeLearningArea}
                        checked={filter.learningAreas.checkAll}
                    >
                        Check all
                    </Checkbox>
                    <Divider />
                    <CheckboxGroup
                        name="learningArea"
                        options={filter.learningAreas.categories}
                        value={filter.learningAreas.checkedList}
                        onChange={onChangeLearningArea}
                    />
                </div>
                <div className="checkbox-container">
                    <p className="filter-type fw_bold">
                        {filter.generalCapabilities.name}
                    </p>
                    <Checkbox
                        indeterminate={filter.generalCapabilities.indeterminate}
                        onChange={onCheckAllChangeGeneralCapability}
                        checked={filter.generalCapabilities.checkAll}
                    >
                        Check all
                    </Checkbox>
                    <Divider />
                    <CheckboxGroup
                        name="generalCapability"
                        options={filter.generalCapabilities.categories}
                        value={filter.generalCapabilities.checkedList}
                        onChange={onChangeGeneralCapability}
                    />
                </div>
            </div>
        </div>
    )
}

export default CheckBoxMy
