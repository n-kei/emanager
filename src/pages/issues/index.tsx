import React from "react";
import { EyeOutlined, DeleteOutlined, PlusSquareOutlined, CloseCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { Button } from 'antd';
import { Select } from 'antd';
import { Space, Table, Tag} from 'antd'
import { Row, Col } from 'antd';
import type { TableProps } from "antd";
import { Link, useNavigate } from 'react-router-dom';
import { Popover } from 'antd';
import { render } from "@testing-library/react";
import { deleteIssueType, IssueType } from "../../types";
import { TableColumnsType } from "antd";

export const IssuesPage: React.FC<{issues: IssueType[], deleteIssue: deleteIssueType}> = ({issues, deleteIssue}) => {
    const navigate = useNavigate();

    const columns: TableColumnsType<IssueType> = [
        {
            key: 'progress',
            title: 'Progress',
            dataIndex: 'progress',
            filters: issues.map(item => ({ text: item.progress, value: item.progress })),
            onFilter: (value: any, record: IssueType) => record.progress === value,
            render: (status: string) => (
                <Select defaultValue={status} style={{ width: 120 }}>
                    <Select.Option value="New">New</Select.Option>
                    <Select.Option value="In Progress">In Progress</Select.Option>
                    <Select.Option value="Resolved">Resolved</Select.Option>
                </Select>
            )
        },
        {
            key: 'ticket_id',
            title: 'Ticket ID',
            dataIndex: 'ticket_id',
            filters: issues.map(item => ({ text: item.ticket_id, value: item.ticket_id })),
            filterSearch: true,
            onFilter: (value: any, record: IssueType) => record.ticket_id.includes(value),
        },
        {
            key: 'title',
            title: 'Title',
            dataIndex: 'title',
            filters: issues.map(item => ({ text: item.title, value: item.title })),
            filterSearch: true,
            onFilter: (value: any, record: IssueType) => record.title.includes(value),
        },
        {
            key: 'system_tags',
            title: 'Systems',
            dataIndex: 'system_tags',
            filters: Array.from(new Set(issues.map(item => item.system_tags.map(tag => ({ text: tag, value: tag }))).flat())),
            filterSearch: true,
            onFilter: (value: any, record: IssueType) => record.system_tags.includes(value),
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
            key: 'error_source_tags',
            title: 'Error Source',
            dataIndex: 'error_source_tags',
            filters: Array.from(new Set(issues.map(item => item.error_source_tags.map(tag => ({ text: tag, value: tag }))).flat())),
            filterSearch: true,
            onFilter: (value: any, record: IssueType) => record.system_tags.includes(value),
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
            key: 'error_category_tags',
            title: 'Error Category',
            dataIndex: 'error_category_tags',
            filters: Array.from(new Set(issues.map(item => item.error_category_tags.map(tag => ({ text: tag, value: tag }))).flat())),
            filterSearch: true,
            onFilter: (value: any, record: IssueType) => record.system_tags.includes(value),
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
            key: 'title',
            title: 'Priority',
            dataIndex: 'priority',
            filters: issues.map(item => ({ text: item.title, value: item.title })),
            filterSearch: true,
            onFilter: (value: any, record: IssueType) => record.title.includes(value),
        },
        {
            key: 'elapsed_days',
            title: 'Elapsed days',
            dataIndex: 'elapsed_days',
            filters: [{ text: 'abandoned', value: 'abandoned' }],
            onFilter: (value: any, record: IssueType) => value === 'abandoned' ? record.elapsed_days >= 30 : false,
            render: (elapsed_days: number) => (
                elapsed_days >= 30 ? <p style={{color: 'red'}}>{elapsed_days}</p> : <p style={{color: 'black'}}>{elapsed_days}</p>
            )
        },
        {
            key: 'remaining_days',
            title: 'Remaining days',
            dataIndex: 'remaining_days',
            filters: [{ text: 'overdue', value: 'overdue' }, { text: 'close deadlines', value: 'close deadlines' }],
            onFilter: (value: any, record: IssueType) => value === 'overdue' ? record.remaining_days < 0 :  value === 'close deadlines' ? record.remaining_days > 0 && record.remaining_days < 7 : false,
            render: (remaining_days: number) => (
                remaining_days < 0 ? <p style={{color: 'red'}}>{remaining_days}</p> : <p style={{color: 'black'}}>{remaining_days}</p>
            )
        },
        {
            key: 'action',
            title: 'Action',
            dataIndex: 'action',
            fixed: 'right',
            render: (text:String, record: IssueType, index:Number) => (
                <Space size="middle">
                    <Button type='text' icon={<EyeOutlined/>} onClick={() => navigate('/issues/edit/' + record.key)}/>
                    <Button type='text' icon={<DeleteOutlined onClick={() => deleteIssue(record.key)} />}/>
                </Space>
            )
        }
    ]
    return (
        <div>
            <Row style={{ marginBottom: 24 }}>
                <Col span={12}>
                    <h1>Issues</h1>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                    <Button type='primary' icon={<PlusSquareOutlined/>}>
                        <Link to={"/issues/create"}>Create new Issue </Link>
                    </Button>
                </Col>
            </Row>
            <Table<IssueType> 
                columns={columns} 
                dataSource={issues} 
                scroll={{ x: 'max-content', y: 'max-content' }}
            />
        </div>
    )
}