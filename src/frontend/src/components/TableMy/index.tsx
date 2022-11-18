import React from 'react'
import { Table, TableProps } from 'antd'

interface TableMyProps<T> {
    tableProps: Pick<TableProps<T>, keyof TableProps<T>>
}

const TableMy = <T extends object = any>(
    props: TableMyProps<T>
): JSX.Element => {
    const { tableProps } = props
    return <Table {...tableProps} />
}

export default TableMy
