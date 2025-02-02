import React from "react";
import { useParams } from "react-router-dom";
import {Space, Row, Col, Divider, Select} from 'antd';
import {Tag} from 'antd';
import { DatePicker } from "antd";
import {Input} from "antd";
import dayjs, { Dayjs } from 'dayjs';
import { EmanagerTag } from "../../../components/tag";
import {Popover} from 'antd';
import { CloseCircleFilled, WarningFilled} from '@ant-design/icons';

import { Timeline } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Typography } from 'antd';
import { Descriptions, DescriptionsProps } from 'antd';
import { Card } from 'antd';
import { editIncidentType, IncidentType } from "../../../types";
import { set } from "@ant-design/plots/es/core/utils";

const { Paragraph, Link } = Typography;

export const EditIncidentPage: React.FC<{incidents: IncidentType[], editIncident: editIncidentType}> = ({incidents, editIncident}) => {
    const params = useParams();

    const incident = incidents.filter(incident => incident.key === params.id)[0];
    const [new_comment, set_new_comment] = React.useState<string>('');

    const set_system_tags = (tags: string[]) => {
        editIncident(params.id as string, {...incident, system_tags: tags});
    }
    const set_error_source_tags = (tags: string[]) => {
        editIncident(params.id as string, {...incident, error_source_tags: tags});
    }
    const set_error_category_tags = (tags: string[]) => {
        editIncident(params.id as string, {...incident, error_category_tags: tags});
    }
    const set_title = (value: string) => {
        editIncident(params.id as string, {...incident, title: value});
    }
    const set_ticket_id = (value: string) => {
        editIncident(params.id as string, {...incident, ticket_id: value});
    }
    const set_sa_url = (value: string) => {
        editIncident(params.id as string, {...incident, sa_url: value});
    }
    const set_due_date = (value: Dayjs) => {
        editIncident(params.id as string, {...incident, due_date: value});
    }
    const add_comment = (value: string) => {
        editIncident(params.id as string, {...incident, comments: [...incident.comments, {date: dayjs(), comment: value}]});
    }
    const set_progress = (value: string) => {
        editIncident(params.id as string, {...incident, progress: value});
    }
    const set_priority = (value: string) => {
        editIncident(params.id as string, {...incident, priority: value});
    }

    const {TextArea} = Input;

    const tags: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Systems',
            children: <EmanagerTag tags={incident.system_tags} setTags={set_system_tags}/>
        },
        {
            key: '2',
            label: 'Error Source',
            children: <EmanagerTag tags={incident.error_source_tags} setTags={set_error_source_tags}/>
        },
        {
            key: '3',
            label: 'Error Category',
            children: <EmanagerTag tags={incident.error_category_tags} setTags={set_error_category_tags}/>
        }
    ]
    const sa_informations: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Ticket ID',
            children: <Paragraph editable={{ onChange: set_ticket_id }}>{incident.ticket_id}</Paragraph>
        },
        {
            key: '2',
            label: 'Link',
            children: <Link href={incident.sa_url} target="_blank">
                <Paragraph editable={{ onChange: set_sa_url }}>{incident.sa_url}</Paragraph>
            </Link>
        },
        {
            key: '3',
            label: 'Due Date',
            children: <DatePicker onChange={set_due_date} defaultValue={incident.due_date} />
        } 
    ]

    return(
        <div>
            <Row style={{ marginBottom: 48 }}>
                <Typography.Title editable={{ onChange: set_title }} level={1} style={{ marginBottom: 12 }}>
                    {incident.title}
                </Typography.Title>
                <Descriptions column={1} items={tags}/>
            </Row>
            <Row>
                <Descriptions column={1} items={sa_informations}/>
            </Row>
            <Divider style={{borderColor: 'lightgray'}}/>

            <Row style={{ marginBottom: 24 }}>
                <Space direction="vertical" size={16}>
                    {incident.comments.map((comment, index) => (
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
                <Col span={6} style={{ textAlign: 'left' }}>
                    <Button type='primary' icon={<PlusSquareOutlined/>} onClick={() => {add_comment(new_comment)}}>
                        Update Investigation Status
                    </Button>
                </Col>
                <Col span={3} style={{ textAlign: 'left' }}>
                    <Select 
                        defaultValue={incident.progress}
                        options={[
                            {label: 'New', value: 'New'},
                            {label: 'In Progress', value: 'In Progress'},
                            {label: 'Resolved', value: 'Resolved'},
                        ]}
                        onChange={set_progress}
                        style={{ width: 120 }}
                    />
                </Col>
                <Col span={3} style={{ textAlign: 'left' }}>
                    <Select 
                        defaultValue={incident.priority} 
                        options={[
                            {label: 'High', value: 'High'},
                            {label: 'Middle', value: 'Middle'},
                            {label: 'Low', value: 'Low'}
                        ]}
                        onChange={set_priority}
                        style={{ width: 120 }}
                    />
                </Col>
            </Row>
        </div>
    )
}