import React from "react";
import { useParams } from "react-router-dom";
import {Space, Row, Divider, Select} from 'antd';
import { DatePicker } from "antd";
import {Input} from "antd";
import dayjs, { Dayjs } from 'dayjs';
import { EmanagerTag } from "../../../components/tag";
import {Drawer} from 'antd';

import { MenuFoldOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Typography } from 'antd';
import { Descriptions, DescriptionsProps } from 'antd';
import { Card } from 'antd';
import { TableHookType, SpecType } from "../../../types";
import { ProgressTypeEnum, PriorityTypeEnum } from "../../../types";

const { Title, Paragraph, Link } = Typography;

export const EditSpecsPage: React.FC<TableHookType<SpecType>> = (specs) => {
    const params = useParams();

    const spec = specs.items.filter(spec => spec.key === params.id)[0];
    const [new_comment, set_new_comment] = React.useState<string>('');

    //TODO: Duplicated Code
    const set_issue_attr = (attr: string, value: any) => {
        specs.editItem(params.id as string, {...spec, [attr]: value});
    }

    const add_comment = (value: string) => {
        specs.editItem(params.id as string, {...spec, comments: [...spec.comments, {date: dayjs(), comment: value}]});
    }
    const set_progress = (value: ProgressTypeEnum) => {
        if (value === ProgressTypeEnum.Closed) {
            specs.editItem(params.id as string, {...spec, progress: value, closed_date: dayjs()});
        } else {
            specs.editItem(params.id as string, {...spec, progress: value, closed_date: null});
        }
    }

    const {TextArea} = Input;

    const status: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Progress',
            children: 
                    <Select 
                        defaultValue={spec.progress}
                        options={[
                            {label: ProgressTypeEnum.New.toString(), value: ProgressTypeEnum.New},
                            {label: ProgressTypeEnum.InProgress.toString(), value: ProgressTypeEnum.InProgress},
                            {label: ProgressTypeEnum.Resolved.toString(), value: ProgressTypeEnum.Resolved},
                            {label: ProgressTypeEnum.Closed.toString(), value: ProgressTypeEnum.Closed},
                        ]}
                        onChange={set_progress}
                        style={{ width: 120 }}
                    />
        },
        {
            key: '2',
            label: 'Priority',
            children:
                    <Select 
                        defaultValue={spec.priority} 
                        options={[
                            {label: PriorityTypeEnum.High.toString(), value: PriorityTypeEnum.High},
                            {label: PriorityTypeEnum.Middle.toString(), value: PriorityTypeEnum.Middle},
                            {label: PriorityTypeEnum.Low.toString(), value: PriorityTypeEnum.Low},
                        ]}
                        onChange={(priority: PriorityTypeEnum) => set_issue_attr("priority", priority)}
                        style={{ width: 120 }}
                    />
        }
    ]
    const tags: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Systems',
            children: <EmanagerTag tags={spec.system_tags} setTags={(tags: string[]) => set_issue_attr("system_tags", tags)}/>
        },
    ]
    const sa_informations: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Ticket ID',
            children: <Paragraph editable={{ onChange: (ticket_id: string) => set_issue_attr("ticket_id", ticket_id)}}>{spec.ticket_id}</Paragraph>
        },
        {
            key: '2',
            label: 'Link',
            children: <Link href={spec.ticket_link.toString()} target="_blank">
                <Paragraph editable={{ onChange: (ticket_link: string) => set_issue_attr("ticket_link", ticket_link) }}>{spec.ticket_link}</Paragraph>
            </Link>
        }
    ]
    const days: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Outage Date',
            children: <DatePicker onChange={(outage_date: Dayjs) => set_issue_attr("outage_date", outage_date)} defaultValue={spec.outage_date} />
        },
        {
            key: '2',
            label: 'Due Date',
            children: <DatePicker onChange={(due_date: Dayjs) => set_issue_attr("due_date", due_date)} defaultValue={spec.due_date} />
        },
        {
            key: '3',
            label: 'Creation Date',
            children: spec.creation_date.format('YYYY-MM-DD')
        },
        {
            key: '4',
            label: 'Closed Date',
            children: spec.closed_date ? spec.closed_date.format('YYYY-MM-DD') : 'Not closed yet'
        },
        {
            key: '5',
            label: 'Elapsed days',
            children: spec.progress === ProgressTypeEnum.New && spec.elapsed_days >= 7 ? <div style={{color: 'gold'}}>{spec.elapsed_days}</div> : <div style={{color: 'black'}}>{spec.elapsed_days}</div>
        },
        {
            key: '6',
            label: 'Remaining days',
            children: spec.remaining_days <= 0 ? <div style={{color: 'red'}}>{spec.remaining_days}</div> : 
                spec.remaining_days < 7 ? <div style={{color: 'orange'}}>{spec.remaining_days}</div> :
                <div style={{color: 'black'}}>{spec.remaining_days}</div>
        }
    ]

    const [open, setOpen] = React.useState(false);

    return(
        <div>
            <Row style={{ marginBottom: 24 }}>
                <Space direction="horizontal" style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Typography.Title editable={{ onChange: (title: string) => set_issue_attr("title", title) }} level={1} style={{ marginBottom: 12 }}>
                        {spec.title}
                    </Typography.Title>
                    <Button variant='outlined' icon={<MenuFoldOutlined/>} onClick={() => {setOpen(true)}}/>
                    <Drawer onClose={() => {setOpen(false)}} open={open}>
                        <Descriptions column={1} items={status}/>
                        <Divider style={{borderColor: 'lightgray'}}/>
                        <Descriptions column={1} items={days}/>
                        <Divider style={{borderColor: 'lightgray'}}/>
                        <Descriptions column={1} items={tags}/>
                        <Divider style={{borderColor: 'lightgray'}}/>
                        <Descriptions column={1} items={sa_informations}/>
                    </Drawer>
                </Space>
            </Row>
            <Row style={{ marginBottom: 24 }}>
                <Typography>
                    <Title level={2}>Abstract</Title>
                    <Paragraph editable={{ onChange: (abstract: string) => set_issue_attr("abstract", abstract) }}>
                        {spec.abstract}
                    </Paragraph>
                </Typography>
            </Row>
            <Row style={{ marginBottom: 24 }}>
                <Typography>
                    <Title level={2}>Statement</Title>
                    <Paragraph editable={{ onChange: (statement: string) => set_issue_attr("statement", statement) }}>
                        {spec.statement}
                    </Paragraph>
                </Typography>
            </Row>
            <Row style={{ marginBottom: 24 }}>
                <Typography>
                    <Title level={2}>Workaround</Title>
                    <Paragraph editable={{ onChange: (workaround: string) => set_issue_attr("workaround", workaround) }}>
                        {spec.workaround}
                    </Paragraph>
                </Typography>
            </Row>
            <Row style={{ marginBottom: 24 }}>
                <Typography>
                    <Title level={2}>Solution</Title>
                    <Paragraph editable={{ onChange: (solution: string) => set_issue_attr("solution", solution) }}>
                        {spec.solution}
                    </Paragraph>
                </Typography>
            </Row>
            <Row style={{ marginBottom: 24 }}>
                <Space direction="vertical" size={16}>
                    {spec.comments.map((comment, index) => (
                        <Card title={comment.date.format('YYYY-MM-DD')} style={{borderColor: 'lightgray'}} key={index}>
                            <p>{comment.comment}</p>
                        </Card>
                    ))}
                </Space>
            </Row>
            <Row style={{ marginBottom: 24 }}>
                <Typography.Title level={3} style={{ margin: 4 }}>
                    Add a comment
                </Typography.Title>
                <TextArea 
                    rows={5} 
                    placeholder='Input latest investigation status' 
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => { set_new_comment(e.target.value)}} 
                />
            </Row>
            <Row style={{ marginBottom: 24 }}>
                <Button type='primary' icon={<PlusSquareOutlined/>} onClick={() => {add_comment(new_comment)}}>
                    Update Investigation Status
                </Button>
            </Row>
        </div>
    )
}