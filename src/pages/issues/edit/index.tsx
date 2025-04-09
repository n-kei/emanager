import React from "react";
import { useParams } from "react-router-dom";
import {Space, Row, Col, Divider, Select} from 'antd';
import {Tag} from 'antd';
import { DatePicker } from "antd";
import {Input} from "antd";
import dayjs, { Dayjs } from 'dayjs';
import { EmanagerTag } from "../../../components/tag";
import {Drawer} from 'antd';

import { Timeline } from 'antd';
import { MenuFoldOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Typography } from 'antd';
import { Descriptions, DescriptionsProps } from 'antd';
import { Card } from 'antd';
import { addEmptyIssueType, editIssueType, IssueType, PriorityTypeEnum, ProgressTypeEnum } from "../../../types";

const { Title, Paragraph, Link } = Typography;

export const EditIssuePage: React.FC<{issues: IssueType[], editIssue: editIssueType}> = ({issues, editIssue}) => {
    const params = useParams();

    const issue = issues.filter(issue => issue.key === params.id)[0];
    const [new_comment, set_new_comment] = React.useState<string>('');

    const set_system_tags = (tags: string[]) => {
        editIssue(params.id as string, {...issue, system_tags: tags});
    }
    const set_error_source_tags = (tags: string[]) => {
        editIssue(params.id as string, {...issue, error_source_tags: tags});
    }
    const set_error_category_tags = (tags: string[]) => {
        editIssue(params.id as string, {...issue, error_category_tags: tags});
    }

    const set_title = (value: string) => {
        editIssue(params.id as string, {...issue, title: value});
    }
    const set_abstract = (value: string) => {
        editIssue(params.id as string, {...issue, abstract: value});
    }
    const set_statement = (value: string) => {
        editIssue(params.id as string, {...issue, statement: value});
    }
    const set_workaround = (value: string) => {
        editIssue(params.id as string, {...issue, workaround: value});
    }
    const set_solution = (value: string) => {
        editIssue(params.id as string, {...issue, solution: value});
    }
    const set_ticket_id = (value: string) => {
        editIssue(params.id as string, {...issue, ticket_id: value});
    }
    const set_ticket_link = (value: string) => {
        editIssue(params.id as string, {...issue, ticket_link: value});
    }
    const set_outage_date = (value: Dayjs) => {
        editIssue(params.id as string, {...issue, outage_date: value, elapsed_days: dayjs().diff(value, 'day')});
    }
    const set_due_date = (value: Dayjs) => {
        editIssue(params.id as string, {...issue, due_date: value, remaining_days: value.diff(dayjs(), 'day') + 1});
    }
    const add_comment = (value: string) => {
        editIssue(params.id as string, {...issue, comments: [...issue.comments, {date: dayjs(), comment: value}]});
    }
    const set_progress = (value: ProgressTypeEnum) => {
        if (value === ProgressTypeEnum.Closed) {
            editIssue(params.id as string, {...issue, progress: value, closed_date: dayjs()});
        } else {
            editIssue(params.id as string, {...issue, progress: value, closed_date: null});
        }
    }
    const set_priority = (value: PriorityTypeEnum) => {
        editIssue(params.id as string, {...issue, priority: value});
    }

    const {TextArea} = Input;

    const status: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Progress',
            children: 
                    <Select 
                        defaultValue={issue.progress}
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
                        defaultValue={issue.priority} 
                        options={[
                            {label: PriorityTypeEnum.High.toString(), value: PriorityTypeEnum.High},
                            {label: PriorityTypeEnum.Middle.toString(), value: PriorityTypeEnum.Middle},
                            {label: PriorityTypeEnum.Low.toString(), value: PriorityTypeEnum.Low},
                        ]}
                        onChange={set_priority}
                        style={{ width: 120 }}
                    />
        }
    ]
    const tags: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Systems',
            children: <EmanagerTag tags={issue.system_tags} setTags={set_system_tags}/>
        },
        {
            key: '2',
            label: 'Error Source',
            children: <EmanagerTag tags={issue.error_source_tags} setTags={set_error_source_tags}/>
        },
        {
            key: '3',
            label: 'Error Category',
            children: <EmanagerTag tags={issue.error_category_tags} setTags={set_error_category_tags}/>
        }
    ]
    const sa_informations: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Ticket ID',
            children: <Paragraph editable={{ onChange: set_ticket_id }}>{issue.ticket_id}</Paragraph>
        },
        {
            key: '2',
            label: 'Link',
            children: <Link href={issue.ticket_link.toString()} target="_blank">
                <Paragraph editable={{ onChange: set_ticket_link }}>{issue.ticket_link}</Paragraph>
            </Link>
        }
    ]
    const days: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Outage Date',
            children: <DatePicker onChange={set_outage_date} defaultValue={issue.outage_date} />
        },
        {
            key: '2',
            label: 'Due Date',
            children: <DatePicker onChange={set_due_date} defaultValue={issue.due_date} />
        },
        {
            key: '3',
            label: 'Creation Date',
            children: issue.creation_date.format('YYYY-MM-DD')
        },
        {
            key: '4',
            label: 'Closed Date',
            children: issue.closed_date ? issue.closed_date.format('YYYY-MM-DD') : 'Not closed yet'
        },
        {
            key: '5',
            label: 'Elapsed days',
            children: issue.progress === ProgressTypeEnum.New && issue.elapsed_days >= 7 ? <div style={{color: 'gold'}}>{issue.elapsed_days}</div> : <div style={{color: 'black'}}>{issue.elapsed_days}</div>
        },
        {
            key: '6',
            label: 'Remaining days',
            children: issue.remaining_days <= 0 ? <div style={{color: 'red'}}>{issue.remaining_days}</div> : 
                issue.remaining_days < 7 ? <div style={{color: 'orange'}}>{issue.remaining_days}</div> :
                <div style={{color: 'black'}}>{issue.remaining_days}</div>
        }
    ]

    const [open, setOpen] = React.useState(false);

    return(
        <div>
            <Row style={{ marginBottom: 24 }}>
                <Space direction="horizontal" style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Typography.Title editable={{ onChange: set_title }} level={1} style={{ marginBottom: 12 }}>
                        {issue.title}
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
                    <Paragraph editable={{ onChange: set_abstract }}>
                        {issue.abstract}
                    </Paragraph>
                </Typography>
            </Row>
            <Row style={{ marginBottom: 24 }}>
                <Typography>
                    <Title level={2}>Statement</Title>
                    <Paragraph editable={{ onChange: set_statement }}>
                        {issue.statement}
                    </Paragraph>
                </Typography>
            </Row>
            <Row style={{ marginBottom: 24 }}>
                <Typography>
                    <Title level={2}>Workaround</Title>
                    <Paragraph editable={{ onChange: set_workaround }}>
                        {issue.workaround}
                    </Paragraph>
                </Typography>
            </Row>
            <Row style={{ marginBottom: 24 }}>
                <Typography>
                    <Title level={2}>Solution</Title>
                    <Paragraph editable={{ onChange: set_solution }}>
                        {issue.solution}
                    </Paragraph>
                </Typography>
            </Row>
            <Row style={{ marginBottom: 24 }}>
                <Space direction="vertical" size={16}>
                    {issue.comments.map((comment, index) => (
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