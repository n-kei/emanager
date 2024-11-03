import React from "react";
import { useParams } from "react-router-dom";
import {Space, Row, Col} from 'antd';
import {Tag} from 'antd';
import { DatePicker } from "antd";
import {Input} from "antd";
import dayjs from 'dayjs';
import { EmanagerTag } from "../../../components/tag";
import {Popover} from 'antd';
import { CloseCircleFilled, WarningFilled} from '@ant-design/icons';

export const EditIncidentPage: React.FC = () => {
    const {TextArea} = Input;
    const params = useParams();
    const data = [
        {
            key: '1',
            ticket_id: 'T001',
            title: 'PCIe error',
            tags: ['critical', 'emergency', 'error'],
            detail: 'This is a PCIe error',
            due: '2025-01-01',
        },
        {
            key: '2',
            ticket_id: 'T002',
            title: 'BIOS error',
            tags: ['warning', 'error'],
            detail: 'This is a BIOS error',
            due: '2025-01-02',
        }
    ]
    const item = data.filter(item => item.key === params.id)[0]

    return(
        <div>
            <Row style={{ marginBottom: 24 }}>
                <Col span={24}>
                        <h1>{item.title}</h1>
                        <h3>{"Ticket ID: " + item.ticket_id}</h3>
                        <EmanagerTag/>
                </Col>
            </Row>
            <Row style={{ marginBottom: 24 }}>
                <Col span={1}>
                    <Popover content=<p>WARN: hugahuga</p> title="Warnings"> <WarningFilled style={{color: 'orange'}}/> </Popover>
                </Col>
                <Col span={23}>
                        <TextArea defaultValue={item.detail}/>
                </Col>
            </Row>
            <Row style={{ marginBottom: 24 }}>
                <Col span={1}>
                    <Popover content=<p>ERROR: hogehoge</p> title="Errors"> <CloseCircleFilled style={{color: 'red'}}/> </Popover>
                </Col>
                <Col span={23}>
                    <DatePicker defaultValue={dayjs(item.due, 'YYYY-MM-DD')} />
                </Col>
            </Row>
        </div>
    )
}