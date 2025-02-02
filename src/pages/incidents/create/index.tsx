import React from 'react';
import {Row, Col} from 'antd';
import { DatePicker } from 'antd';
import {Input} from 'antd';
import { EmanagerTag } from '../../../components/tag';
import { addIncidentType, IncidentType } from '../../../types';
import { Descriptions, DescriptionsProps } from 'antd';
import { Typography } from 'antd';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { Divider } from 'antd';
import { Button } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';

const { Paragraph, Link } = Typography;

export const CreateIncidentPage: React.FC<{incidents: IncidentType[], addIncident: addIncidentType}> = ({incidents, addIncident}) => {
    const {TextArea} = Input;

    const [new_incident, set_new_incident] = React.useState<IncidentType>({
        key: (incidents.length + 1).toString(),
        title: "Title",
        system_tags: [''],
        error_source_tags: [''],
        error_category_tags: [''],
        ticket_id: "",
        due_date: dayjs(),
        progress: "New",
        priority: "Low",
        sa_url: "",
        elapsed_days: 0,
        remaining_days: 0,
        creation_date: dayjs(),
        comments: [
            {date: dayjs(), comment: 'Created'}
        ],
    });

    const set_title = (value: string) => {
        set_new_incident({...new_incident, title: value});
    }
    const set_system_tags = (tags: string[]) => {
        set_new_incident({...new_incident, system_tags: tags});
    }
    const set_error_source_tags = (tags: string[]) => {
        set_new_incident({...new_incident, error_source_tags: tags});
    }
    const set_error_category_tags = (tags: string[]) => {
        set_new_incident({...new_incident, error_category_tags: tags});
    }
    const set_ticket_id = (value: string) => {
        set_new_incident({...new_incident, ticket_id: value});
    }
    const set_sa_url = (value: string) => {
        set_new_incident({...new_incident, sa_url: value});
    }
    const set_due_date = (value: Dayjs) => {
        set_new_incident({...new_incident, due_date: value});
    }

    const set_comment = (value: string) => {
        set_new_incident({...new_incident, comments: [{date: dayjs(), comment: value}]});
    }

    const tags: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Systems',
            children: <EmanagerTag tags={new_incident.system_tags} setTags={set_system_tags}/>
        },
        {
            key: '2',
            label: 'Error Source',
            children: <EmanagerTag tags={new_incident.error_source_tags} setTags={set_error_source_tags}/>
        },
        {
            key: '3',
            label: 'Error Category',
            children: <EmanagerTag tags={new_incident.error_category_tags} setTags={set_error_category_tags}/>
        }
    ]
    const sa_informations: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Ticket ID',
            children: <Paragraph editable={{ onChange: set_ticket_id }}>{new_incident.ticket_id}</Paragraph>
        },
        {
            key: '2',
            label: 'Link',
            children: <Link href={new_incident.sa_url} target="_blank">
                <Paragraph editable={{ onChange: set_sa_url }}>{new_incident.sa_url}</Paragraph>
            </Link>
        },
        {
            key: '3',
            label: 'Due Date',
            children: <DatePicker onChange={set_due_date} defaultValue={new_incident.due_date} />
        } 
    ]


    return(
        <div>
            <Row style={{ marginBottom: 48 }}>
                <Typography.Title editable={{ onChange: set_title }} level={1} style={{ marginBottom: 12 }}>
                    {new_incident.title}
                </Typography.Title>
                <Descriptions column={1} items={tags}/>
            </Row>
            <Row>
                <Descriptions column={1} items={sa_informations}/>
            </Row>
            <Divider style={{borderColor: 'lightgray'}}/>

            <Row style={{ marginBottom: 24 }}>
                <Typography.Title level={3} style={{ margin: 4 }}>
                    Add a comment
                </Typography.Title>
                <TextArea rows={5} placeholder='Input latest investigation status' onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => { set_comment(e.target.value)}} />
            </Row>
            <Row style={{ marginBottom: 24 }}>
                <Col span={6} style={{ textAlign: 'left' }}>
                    <Button type='primary' icon={<PlusSquareOutlined/>} onClick={() => { addIncident(new_incident) }}>
                        Update Investigation Status
                    </Button>
                </Col>
            </Row>
        </div>
    )
}