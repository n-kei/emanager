import React from "react";
import { EyeOutlined, DeleteOutlined, PlusSquareOutlined, CloseCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { Button } from 'antd';
import { Select } from 'antd';
import { Space, Table, Tag} from 'antd'
import { Row, Col } from 'antd';
import type { TableProps } from "antd";
import { Link } from 'react-router-dom';
import { Popover } from 'antd';
import { render } from "@testing-library/react";
import { IncidentType } from "../../types";

export const IncidentsPage: React.FC<{incidents: IncidentType[]}> = ({incidents}) => {
    const errors = (
        <div>
            <p>ERROR: hogehoge</p>
            <p>WARN: hugahuga</p>
        </div>
    )

    const columns = [
        {
            title: 'Progress',
            dataIndex: 'progress',
            key: 'progress',
            filters: incidents.map(item => ({ text: item.progress, value: item.progress })),
            onFilter: (value: any, record: IncidentType) => record.progress === value,
            render: (status: string) => (
                <Select defaultValue={status} style={{ width: 120 }}>
                    <Select.Option value="New">New</Select.Option>
                    <Select.Option value="In Progress">In Progress</Select.Option>
                    <Select.Option value="Resolved">Resolved</Select.Option>
                </Select>
            )
        },
        //TODO: statusの表示を実装する
        //{
        //    title: 'Status',
        //    dataIndex: 'status',
        //    key: 'status',
        //    filters: incidents.map(item => ({ text: item.status, value: item.status })),
        //    onFilter: (value: any, record: IncidentType) => record.status === value,
        //    render: (status: string) => (
        //        status === 'ok' ? <CheckCircleFilled style={{color: 'green'}}/> :
        //        <Popover content={errors} title="Erros and Warnings"> <CloseCircleFilled style={{color: 'red'}}/> </Popover>
        //    )
        //},
        {
            title: 'Ticket ID',
            dataIndex: 'ticket_id',
            key: 'ticket_id',
            filters: incidents.map(item => ({ text: item.ticket_id, value: item.ticket_id })),
            filterSearch: true,
            onFilter: (value: any, record: IncidentType) => record.ticket_id.includes(value),
        },
        {
            title: 'Title',
            dataIndex: 'title',
            filters: incidents.map(item => ({ text: item.title, value: item.title })),
            filterSearch: true,
            onFilter: (value: any, record: IncidentType) => record.title.includes(value),
            key: 'title',
        },
        {
            title: 'Systems',
            key: 'system_tags',
            dataIndex: 'system_tags',
            filters: Array.from(new Set(incidents.map(item => item.system_tags.map(tag => ({ text: tag, value: tag }))).flat())),
            filterSearch: true,
            onFilter: (value: any, record: IncidentType) => record.system_tags.includes(value),
            render: (tags: string[]) => (
                <>
                    {tags.map(tag => {
                        let color = tag.length > 5 ? 'geekblue' : 'green'
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
            title: 'Error Source',
            key: 'error_source_tags',
            dataIndex: 'error_source_tags',
            filters: Array.from(new Set(incidents.map(item => item.error_source_tags.map(tag => ({ text: tag, value: tag }))).flat())),
            filterSearch: true,
            onFilter: (value: any, record: IncidentType) => record.system_tags.includes(value),
            render: (tags: string[]) => (
                <>
                    {tags.map(tag => {
                        let color = tag.length > 5 ? 'geekblue' : 'green'
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
            title: 'Error Category',
            key: 'error_category_tags',
            dataIndex: 'error_category_tags',
            filters: Array.from(new Set(incidents.map(item => item.error_category_tags.map(tag => ({ text: tag, value: tag }))).flat())),
            filterSearch: true,
            onFilter: (value: any, record: IncidentType) => record.system_tags.includes(value),
            render: (tags: string[]) => (
                <>
                    {tags.map(tag => {
                        let color = tag.length > 5 ? 'geekblue' : 'green'
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
            title: 'Priority',
            dataIndex: 'priority',
            filters: incidents.map(item => ({ text: item.title, value: item.title })),
            filterSearch: true,
            onFilter: (value: any, record: IncidentType) => record.title.includes(value),
            key: 'title',
        },
        {
            title: 'Elapsed days',
            dataIndex: 'elapsed_days',
            filters: [{ text: 'abandoned', value: 'abandoned' }],
            onFilter: (value: any, record: IncidentType) => value === 'abandoned' ? record.elapsed_days >= 30 : false,
            key: 'elapsed_days',
            render: (elapsed_days: number) => (
                elapsed_days >= 30 ? <p style={{color: 'red'}}>{elapsed_days}</p> : <p style={{color: 'black'}}>{elapsed_days}</p>
            )
        },
        {
            title: 'Remaining days',
            dataIndex: 'remaining_days',
            filters: [{ text: 'overdue', value: 'overdue' }, { text: 'close deadlines', value: 'close deadlines' }],
            onFilter: (value: any, record: IncidentType) => value === 'overdue' ? record.remaining_days < 0 :  value === 'close deadlines' ? record.remaining_days > 0 && record.remaining_days < 7 : false,
            key: 'remaining_days',
            render: (remaining_days: number) => (
                remaining_days < 0 ? <p style={{color: 'red'}}>{remaining_days}</p> : <p style={{color: 'black'}}>{remaining_days}</p>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (text:String, record: IncidentType, index:Number) => (
                <Space size="middle">
                    <Link to={"/incidents/edit/" + record.key}><EyeOutlined/></Link>
                    {/*TODO: deleteの実装*/}
                    <a><DeleteOutlined/></a>
                </Space>
            )
        }
    ]
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
            <Table<IncidentType> columns={columns} dataSource={incidents} />
        </div>
    )
}