import React from 'react';
import {Row, Col} from 'antd';
import { DatePicker } from 'antd';
import {Input} from 'antd';
import { EmanagerTag } from '../../../components/tag';

export const CreateIncidentPage: React.FC = () => {
    const {TextArea} = Input;
    return(
        <div>
            <Row style={{ marginBottom: 24 }}>
                <Col span={24}>
                        <Input placeholder='Title' variant='filled'/>
                        <Input placeholder='Ticket ID' variant='filled'/>
                        <EmanagerTag/>
                </Col>
            </Row>
            <Row style={{ marginBottom: 24 }}>
                <Col span={24}>
                        <TextArea placeholder={"detail"} />
                </Col>
            </Row>
            <Row style={{ marginBottom: 24 }}>
                <Col span={24}>
                        <DatePicker />
                </Col>
            </Row>
        </div>
    )
}