import React from 'react'
import { Modal, Button } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import './index.scss'
import { showModalSelector, setShowModal } from '../../store/reducers/mapping'
import SearchableTree from '../SearchableTree'

const MappingCurriculumModal = (): JSX.Element => {
    const visible = useSelector(showModalSelector)
    const dispatch = useDispatch()
    const onClose = (): void => {
        dispatch(setShowModal(false))
    }
    const handleOk = (): void => {
        dispatch(setShowModal(false))
    }
    return (
        <Modal
            width="80%"
            centered
            visible={visible}
            title="Map to Australian F-10 Curriculum"
            onOk={handleOk}
            onCancel={onClose}
            footer={[
                <Button key="submit" type="primary" onClick={handleOk}>
                    Map
                </Button>,
                <Button key="back" onClick={onClose}>
                    Cancel
                </Button>,
            ]}
        >
            <SearchableTree />
        </Modal>
    )
}
export default MappingCurriculumModal
