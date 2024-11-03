import React from "react";
import { EyeOutlined, DeleteOutlined, PlusSquareOutlined, CloseCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { Button } from 'antd';
import { Space, Table, Tag} from 'antd'
import { Row, Col } from 'antd';
import type { TableProps } from "antd";
import { Link } from 'react-router-dom';
import { Popover } from 'antd';

interface DataType {
    key: string
    status: string
    ticket_id: string
    title: string
    tags: string[]
}

const data: DataType[] = [
    {
        key: '1',
        status: 'ok',
        ticket_id: 'T001',
        title: 'PCIe error',
        tags: ['critical', 'emergency', 'error']
    },
    {
        key: '2',
        status: 'ng',
        ticket_id: 'T002',
        title: 'BIOS error',
        tags: ['warning', 'error']
    }
]

const errors = (
    <div>
        <p>ERROR: hogehoge</p>
        <p>WARN: hugahuga</p>
    </div>
)

const columns = [
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        filters: data.map(item => ({ text: item.status, value: item.status })),
        onFilter: (value: any, record: DataType) => record.status === value,
        render: (status: string) => (
            status === 'ok' ? <CheckCircleFilled style={{color: 'green'}}/> :
            <Popover content={errors} title="Erros and Warnings"> <CloseCircleFilled style={{color: 'red'}}/> </Popover>
        )
    },
    {
        title: 'Ticket ID',
        dataIndex: 'ticket_id',
        key: 'ticket_id',
        filters: data.map(item => ({ text: item.ticket_id, value: item.ticket_id })),
        filterSearch: true,
        onFilter: (value: any, record: DataType) => record.ticket_id.includes(value),
    },
    {
        title: 'Title',
        dataIndex: 'title',
        filters: data.map(item => ({ text: item.title, value: item.title })),
        filterSearch: true,
        onFilter: (value: any, record: DataType) => record.title.includes(value),
        key: 'title',
    },
    {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
        filters: Array.from(new Set(data.map(item => item.tags.map(tag => ({ text: tag, value: tag }))).flat())),
        filterSearch: true,
        onFilter: (value: any, record: DataType) => record.tags.includes(value),
        render: (tags: string[]) => (
            <>
                {tags.map(tag => {
                    let color = tag.length > 5 ? 'geekblue' : 'green'
                    if (tag === 'critical') {
                        color = 'volcano'
                    }
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    )
                })}
            </>
        )
    },
    {
        title: 'Action',
        key: 'action',
        render: (text:String, record: DataType, index:Number) => (
            <Space size="middle">
                <Link to={"/incidents/edit/" + record.key}><EyeOutlined/></Link>
                <a><DeleteOutlined/></a>
            </Space>
        )
    }
]

export const IncidentsPage: React.FC = () => {
    return (
        <div>
            <Row style={{ marginBottom: 24 }}>
                <Col span={12}>
                    <h1>Incidents</h1>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                    <Button type='primary' icon={<PlusSquareOutlined/>}>
                        <Link to={"/incidents/create"}>Create new incident </Link>
                    </Button>
                </Col>
            </Row>
            <Table<DataType> columns={columns} dataSource={data} />
        </div>
    )
}