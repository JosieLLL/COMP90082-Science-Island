import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Pagination } from 'antd'
import './index.scss'
import {
    totalNumSelector,
    pageSelector,
    pageSizeSelector,
    setPage,
    setPageSize,
    setTotalNum,
    setActivityPool,
    filtersSelector,
} from '../../store/reducers/activityPool'
import { GetActivityPoolApi } from '../../api'
import { filterParams } from '../../utils/helper'

const PaginationMy = (): JSX.Element => {
    const dispatch = useDispatch()
    const totalNum = Number(useSelector(totalNumSelector))
    const pageSize = Number(useSelector(pageSizeSelector))
    const currentPage = Number(useSelector(pageSelector))
    const filter = useSelector(filtersSelector)
    const onChange = (page: number, size: number): void => {
        const params = {
            ...filterParams(filter),
            page,
            pageLimit: size,
        }
        GetActivityPoolApi(params).then((res) => {
            dispatch(setActivityPool(res.Data.Activities))
            dispatch(setTotalNum(res.Data.TotalNum))
            dispatch(setPage(page))
            dispatch(setPageSize(res.Data.PageSize))
        })
    }
    return (
        <div className="pagination-container">
            <Pagination
                current={currentPage}
                hideOnSinglePage
                onChange={onChange}
                total={totalNum}
                pageSize={pageSize}
                showSizeChanger
                showQuickJumper
            />
        </div>
    )
}

export default PaginationMy
