import React from "react";
import { EyeOutlined, DeleteOutlined, PlusSquareOutlined, CloseCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { Button } from 'antd';
import { Select } from 'antd';
import { Space, Table, Tag} from 'antd'
import { Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SpecType, ProgressTypeEnum, PriorityTypeEnum, TableHookType } from "../../types";
import { TableColumnsType } from "antd";
import dayjs, { Dayjs } from 'dayjs';

export const SpecsPage: React.FC<TableHookType<SpecType>> = (specs) => {
    const navigate = useNavigate();

    const handleAddEmptyspec = () => {
        const key = specs.addEmptyItem();
        console.log(key);
        navigate('/specs/edit/' + key);
    }

    // TODO: Duplicated Code
    const set_progress = (key: string, value: ProgressTypeEnum) => {
        const spec = specs.items.filter(spec => spec.key === key)[0];
        if(value === ProgressTypeEnum.Closed) {
            specs.editItem(key, {...spec, progress: value, closed_date: dayjs()});
        } else {
            specs.editItem(key, {...spec, progress: value, closed_date: null});
        }
    }

    const columns: TableColumnsType<SpecType> = [
        {
            key: 'progress',
            title: 'Progress',
            dataIndex: 'progress',
            filters: [
                { text: ProgressTypeEnum.New, value: ProgressTypeEnum.New },
                { text: ProgressTypeEnum.InProgress, value: ProgressTypeEnum.InProgress },
                { text: ProgressTypeEnum.Resolved, value: ProgressTypeEnum.Resolved },
                { text: ProgressTypeEnum.Closed, value: ProgressTypeEnum.Closed },
            ], 
            onFilter: (value: any, record: SpecType) => record.progress === value,
            render: (status: string, record: SpecType) => (
                <Select defaultValue={status} style={{ width: 120 }} onChange={(value) => set_progress(record.key, value as ProgressTypeEnum)}>
                    <Select.Option value={ProgressTypeEnum.New}>New</Select.Option>
                    <Select.Option value={ProgressTypeEnum.InProgress}>In Progress</Select.Option>
                    <Select.Option value={ProgressTypeEnum.Resolved}>Resolved</Select.Option>
                    <Select.Option value={ProgressTypeEnum.Closed}>Closed</Select.Option>
                </Select>
            )
        },
        {
            key: 'outage_date',
            title: 'Outage date',
            dataIndex: 'outage_date',
            filters: specs.items.map(item => ({ text: item.outage_date.format('YYYY/MM/DD'), value: item.outage_date.format('YYYY/MM/DD') })).filter(
                (item, index, self) => index === self.findIndex((t) => t.value === item.value)
            ),
            filterSearch: true,
            onFilter: (value: any, record: SpecType) => record.outage_date.format('YYYY/MM/DD').includes(value),
            defaultSortOrder: 'descend',
            sorter: (a: SpecType, b: SpecType) => a.outage_date.diff(b.outage_date),
            render: (outage_date: Dayjs) => (
                <>
                    <p>{outage_date.format('YYYY/MM/DD')}</p>
                </>
            )
        },
        {
            key: 'ticket_id',
            title: 'Ticket ID',
            dataIndex: 'ticket_id',
            filters: specs.items.map(item => ({ text: item.ticket_id, value: item.ticket_id })).filter(
                (item, index, self) => index === self.findIndex((t) => t.value === item.value)
            ),
            filterSearch: true,
            onFilter: (value: any, record: SpecType) => record.ticket_id.includes(value),
        },
        {
            key: 'title',
            title: 'Title',
            dataIndex: 'title',
            filters: specs.items.map(item => ({ text: item.title, value: item.title })).filter(
                (item, index, self) => index === self.findIndex((t) => t.value === item.value)
            ),
            filterSearch: true,
            onFilter: (value: any, record: SpecType) => record.title.includes(value),
        },
        {
            key: 'system_tags',
            title: 'Systems',
            dataIndex: 'system_tags',
            filters: specs.items.map(item => item.system_tags.map(tag => ({ text: tag, value: tag }))).flat().filter(
                (item, index, self) => index === self.findIndex((t) => t.value === item.value)
            ),
            filterSearch: true,
            onFilter: (value: any, record: SpecType) => record.system_tags.includes(value),
            render: (tags: string[]) => (
                <>
                    {tags.map(tag => {
                        const color = tag.length > 7 ? 'geekblue' : 
                                      tag.length > 5 ? 'green' :
                                      tag.length > 3 ? 'orange' : 'red'
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
            key: 'priority',
            title: 'Priority',
            dataIndex: 'priority',
            filters: [
                { text: PriorityTypeEnum.High, value: PriorityTypeEnum.High },
                { text: PriorityTypeEnum.Middle, value: PriorityTypeEnum.Middle },
                { text: PriorityTypeEnum.Low, value: PriorityTypeEnum.Low },
            ],
            filterSearch: true,
            onFilter: (value: any, record: SpecType) => record.priority.includes(value),
        },
        {
            key: 'elapsed_days',
            title: 'Elapsed days',
            dataIndex: 'elapsed_days',
            sorter: (a: SpecType, b: SpecType) => a.elapsed_days - b.elapsed_days,
            render: (elapsed_days: number, record: SpecType) => (
                record.progress === ProgressTypeEnum.New && elapsed_days >= 7 ? <p style={{color: 'gold'}}>{elapsed_days}</p> : <p style={{color: 'black'}}>{elapsed_days}</p>
            )
        },
        {
            key: 'remaining_days',
            title: 'Remaining days',
            dataIndex: 'remaining_days',
            sorter: (a: SpecType, b: SpecType) => a.remaining_days - b.remaining_days,
            render: (remaining_days: number) => (
                remaining_days <= 0 ? <p style={{color: 'red'}}>{remaining_days}</p> : 
                remaining_days < 7 ? <p style={{color: 'orange'}}>{remaining_days}</p> :
                <p style={{color: 'black'}}>{remaining_days}</p>
            )
        },
        {
            key: 'action',
            title: 'Action',
            dataIndex: 'action',
            fixed: 'right',
            render: (text:String, record: SpecType, index:Number) => (
                <Space size="middle">
                    <Button type='text' icon={<EyeOutlined/>} onClick={() => navigate('/specs/edit/' + record.key)}/>
                    <Button type='text' icon={<DeleteOutlined onClick={() => specs.deleteItem(record.key)} />}/>
                </Space>
            )
        }
    ]
    return (
        <div>
            <Row style={{ marginBottom: 24 }}>
                <Col span={12}>
                    <h1>Specs</h1>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                    <Button type='primary' icon={<PlusSquareOutlined/>} onClick={handleAddEmptyspec} >
                        Create new spec
                    </Button>
                </Col>
            </Row>
            <Table<SpecType> 
                columns={columns} 
                dataSource={specs.items} 
                scroll={{ x: 'max-content', y: 'max-content' }}
            />
        </div>
    )
}