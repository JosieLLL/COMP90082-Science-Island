import React from 'react'
import './index.scss'
import { subjectType } from '../../api/apis/MapCurriculumAPI'

const SubjectItem = (props: { subject: subjectType }): JSX.Element => {
    const { subject } = props
    return (
        <div
            className="subjectItemContainer"
            key={`${subject.Subject}-${subject.Title}`}
        >
            <div className="subject">
                <div className="subjectHeader ft_color_555 fw_bold">{`${subject.Subject}: ${subject.YearLevel} | ${subject.Title} | ${subject.SubTitle}`}</div>
            </div>
        </div>
    )
}

export default SubjectItem
