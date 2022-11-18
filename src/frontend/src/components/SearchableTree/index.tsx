import React, { Key, ReactNode, useEffect, useState } from 'react'
import type { ColumnsType } from 'antd/lib/table'
import {
    Layout,
    Tree,
    Input,
    Divider,
    Select,
    TreeDataNode,
    Spin,
    Button,
} from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import TableMy from '../TableMy'
import CurriculumItem from '../CurriculumItem'
import SubjectItem from '../SubjectItem'
import { GetCurriculumApi } from '../../api'
import './index.scss'
import {
    curriculumsType,
    getSubjectParamsTypes,
    subjectType,
    treeType,
} from '../../api/apis/MapCurriculumAPI'
import {
    setSelectedCurriculums,
    selectedCurriculumsSelector,
} from '../../store/reducers/mapping'
import { YEAR_LEVEL } from '../../utils/constants'

const columns: ColumnsType<subjectType> = [
    {
        title: 'Subject',
        dataIndex: 'Subject',
        render: (_, record) => <SubjectItem subject={record} />,
    },
]

interface DataNode extends TreeDataNode {
    key: string | number
    title: string
    children: DataNode[]
    subjectNum: number
    level: number
    checkable: boolean
}

const SearchableTree = (): JSX.Element => {
    const dispatch = useDispatch()
    const { Header, Sider, Content } = Layout
    const { Search } = Input
    const { Option } = Select
    const selectedCurriculums = useSelector(selectedCurriculumsSelector)
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
    const [treeData, setTreeData] = useState<DataNode[]>([])
    const [expandedKeys, setExpandedKeys] = useState<Key[]>([])
    const [checkedKeys, setCheckedKeys] = useState<Key[]>([])
    const [subParams, setSubParams] = useState<getSubjectParamsTypes>({})
    const [resultsNum, setResultsNum] = useState(0)
    const [yearLevel, setYearLevel] = useState<number | undefined>(undefined)
    const [AF10Curriculums, setAF10Curriculums] = useState<subjectType[]>([])
    const [spinLoading, setSpinLoading] = useState<boolean>(false)
    const generateTreeData = (rawData: treeType[]): DataNode[] => {
        const res: DataNode[] = []
        rawData.forEach((item) => {
            res.push({
                key: item.Title,
                title: item.Title,
                children: generateTreeData(
                    item.Children === null ? [] : item.Children
                ),
                checkable: item.IsLeaf,
                subjectNum: item.SubjectNum,
                level: item.Level,
            })
        })
        return res
    }
    const resetData = (num: number, data: subjectType[]): void => {
        setResultsNum(num || 0)
        setAF10Curriculums(data || [])
    }
    useEffect(() => {
        setSpinLoading(true)
        GetCurriculumApi(subParams).then((res) => {
            resetData(res.Data.TotalNum, res.Data.StrandInfors)
            setTreeData(
                res.Data.SubjectFilter === null
                    ? []
                    : generateTreeData(res.Data.SubjectFilter)
            )
            setSpinLoading(false)
        })
    }, [])
    const renderTitle = (nodeData: DataNode): ReactNode => (
        <p>{`${nodeData.title} - ${nodeData.subjectNum}`}</p>
    )
    const onSelectChange = (
        record: curriculumsType,
        selected: boolean
    ): void => {
        const newAddedCurriculumKeys = new Set(selectedRowKeys)
        const newAddedSelectedCurriculums = new Set(selectedCurriculums)
        if (selected) {
            if (!newAddedCurriculumKeys.has(record.CurriculumID))
                newAddedCurriculumKeys.add(record.CurriculumID)
            if (!newAddedSelectedCurriculums.has(record))
                newAddedSelectedCurriculums.add(record)
        } else {
            if (newAddedCurriculumKeys.has(record.CurriculumID))
                newAddedCurriculumKeys.delete(record.CurriculumID)
            if (newAddedSelectedCurriculums.has(record))
                newAddedSelectedCurriculums.delete(record)
        }
        setSelectedRowKeys(Array.from(newAddedCurriculumKeys))
        dispatch(
            setSelectedCurriculums(Array.from(newAddedSelectedCurriculums))
        )
    }
    const rowSelection = {
        selectedRowKeys,
        onSelect: onSelectChange,
    }
    const expandedRowRender = (record: subjectType): JSX.Element => {
        const subColumns: ColumnsType<curriculumsType> = [
            {
                title: 'Curriculum',
                dataIndex: 'CurriculumID',
                render: (_, item) => <CurriculumItem curriculum={item} />,
            },
        ]

        return (
            <TableMy
                tableProps={{
                    rowKey: (item) => item.CurriculumID,
                    rowSelection,
                    columns: subColumns,
                    dataSource:
                        record.CurriculumInfors === null
                            ? undefined
                            : record.CurriculumInfors,
                    pagination: false,
                    showHeader: false,
                }}
            />
        )
    }
    const onCheck = (checked: any): void => {
        setSpinLoading(true)
        setCheckedKeys(checked)
        const params = {
            ...subParams,
            subjects: checked.join(','),
            page: 1,
            pageLimit: 10,
        }
        setSubParams(params)
        GetCurriculumApi(params).then((res) => {
            resetData(res.Data.TotalNum, res.Data.StrandInfors)
            // setTreeData(generateTreeData(res.Data.SubjectFilter))
            setSpinLoading(false)
        })
    }
    const onYearLevelSelected = (value: number): void => {
        setSpinLoading(true)
        setYearLevel(value)
        const params = {
            ...subParams,
            page: 1,
            pageLimit: 10,
            yearLevel: value,
        }
        setSubParams(params)
        GetCurriculumApi(params).then((res) => {
            resetData(res.Data.TotalNum, res.Data.StrandInfors)
            setTreeData(
                res.Data.SubjectFilter === null
                    ? []
                    : generateTreeData(res.Data.SubjectFilter)
            )
            setSpinLoading(false)
        })
    }
    const clearFilter = (): void => {
        setSpinLoading(true)
        const params = {
            page: 1,
            pageLimit: 10,
        }
        setSubParams(params)
        GetCurriculumApi(params).then((res) => {
            resetData(res.Data.TotalNum, res.Data.StrandInfors)
            setYearLevel(undefined)
            setCheckedKeys([])
            setTreeData(
                res.Data.SubjectFilter === null
                    ? []
                    : generateTreeData(res.Data.SubjectFilter)
            )
            setSpinLoading(false)
        })
    }
    const onYearLevelClear = (): void => {
        setSpinLoading(true)
        setYearLevel(undefined)
        const params = {
            ...subParams,
            page: 1,
            pageLimit: 10,
            yearLevel: undefined,
        }
        setSubParams(params)
        GetCurriculumApi(params).then((res) => {
            resetData(res.Data.TotalNum, res.Data.StrandInfors)
            setTreeData(
                res.Data.SubjectFilter === null
                    ? []
                    : generateTreeData(res.Data.SubjectFilter)
            )
            setSpinLoading(false)
        })
    }
    const onTablePaginationChange = (page: number, pageSize: number): void => {
        setSpinLoading(true)
        const params = {
            ...subParams,
            page,
            pageLimit: pageSize,
        }
        setSubParams(params)
        GetCurriculumApi(params).then((res) => {
            resetData(res.Data.TotalNum, res.Data.StrandInfors)
            setSpinLoading(false)
        })
    }
    const onExpand = (expandedKeysValue: Key[]): void =>
        setExpandedKeys(expandedKeysValue)
    const onSearch = (value: string): void => {
        setSpinLoading(true)
        const params = {
            code: value,
            page: 1,
            pageLimit: 10,
        }
        setSubParams(params)
        GetCurriculumApi(params).then((res) => {
            resetData(res.Data.TotalNum, res.Data.StrandInfors)
            setTreeData(
                res.Data.SubjectFilter === null
                    ? []
                    : generateTreeData(res.Data.SubjectFilter)
            )
            setSpinLoading(false)
        })
    }
    return (
        <div className="serchableTreeContainer">
            <Layout>
                <Header>
                    <Search
                        placeholder="input search text"
                        allowClear
                        enterButton="Search"
                        size="large"
                        onSearch={onSearch}
                    />
                </Header>
                <Layout>
                    <Spin spinning={spinLoading} size="large" />
                    <Sider width="30%">
                        <div className="sider_header">
                            <p className="fw_bold">Filter</p>
                            <Button
                                className="mr_15"
                                type="primary"
                                size="small"
                                shape="round"
                                onClick={clearFilter}
                            >
                                Clear
                            </Button>
                        </div>
                        <Divider />
                        <p className="fw_bold mb_5 ft_color_555">
                            Learning Area
                        </p>
                        <Tree
                            onCheck={onCheck}
                            onExpand={onExpand}
                            treeData={treeData}
                            showLine
                            checkable
                            titleRender={renderTitle}
                            defaultExpandAll
                            expandedKeys={expandedKeys}
                            checkedKeys={checkedKeys}
                        />
                        <Divider />
                        <p className="fw_bold mb_5 ft_color_555">Year Level</p>
                        <Select
                            style={{ width: 120 }}
                            allowClear
                            value={yearLevel}
                            onSelect={onYearLevelSelected}
                            onClear={onYearLevelClear}
                        >
                            {YEAR_LEVEL.slice(0, -1).map((item) => (
                                <Option value={item.name} key={item.id}>
                                    {item.name}
                                </Option>
                            ))}
                        </Select>
                    </Sider>
                    <Content className="pd_10">
                        <p className="fw_bold ft_color_555">{`${resultsNum} Result(s) Returned`}</p>
                        <Divider />
                        <TableMy
                            tableProps={{
                                rowKey: (record) =>
                                    `${record.Subject}-${record.YearLevel}-${record.Title}-${record.SubTitle}`,
                                columns,
                                dataSource: AF10Curriculums,
                                expandable: {
                                    expandedRowRender,
                                    defaultExpandAllRows: true,
                                },
                                showHeader: false,
                                pagination: {
                                    total: resultsNum,
                                    defaultCurrent: 1,
                                    current: subParams.page,
                                    hideOnSinglePage: true,
                                    pageSize: subParams.pageLimit,
                                    showQuickJumper: true,
                                    onChange: onTablePaginationChange,
                                },
                            }}
                        />
                    </Content>
                </Layout>
            </Layout>
        </div>
    )
}

export default SearchableTree
