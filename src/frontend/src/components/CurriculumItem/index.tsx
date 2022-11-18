import React from 'react'
import './index.scss'
import { curriculumsType } from '../../api/apis/MapCurriculumAPI'

const CurriculumItem = (props: {
    curriculum: curriculumsType
}): JSX.Element => {
    const { curriculum } = props
    return (
        <div className="curriculumItemContainer" key={curriculum.CurriculumID}>
            <div className="curriculumItem">{`${curriculum.Description}`}</div>
            <div className="curriculumCode">{`Code: ${curriculum.Code}`}</div>
        </div>
    )
}

export default CurriculumItem
