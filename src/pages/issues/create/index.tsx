import React from 'react';
import {Row, Col} from 'antd';
import { DatePicker } from 'antd';
import {Input} from 'antd';
import { EmanagerTag } from '../../../components/tag';
import { addIssueType, IssueType, PriorityTypeEnum, ProgressTypeEnum } from '../../../types';
import { Descriptions, DescriptionsProps } from 'antd';
import { Typography } from 'antd';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { Divider } from 'antd';
import { Button } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';

const { Paragraph, Link } = Typography;

export const CreateIssuePage: React.FC<{issues: IssueType[], addIssue: addIssueType}> = ({issues, addIssue}) => {
    const {TextArea} = Input;

    const [new_Issue, set_new_Issue] = React.useState<IssueType>({
        key: (issues.length + 1).toString(),
        title: "Title",
        creation_date: dayjs(),
        abstract: "",
        statement: "",
        workaround: "",
        solution: "",
        comments: [
            {date: dayjs(), comment: 'Created'}
        ],

        progress: ProgressTypeEnum.New,
        priority: PriorityTypeEnum.Middle,
        system_tags: [],
        error_source_tags: [],
        error_category_tags: [],
        ticket_id: "",
        ticket_link: "",
        due_date: dayjs(),
        elapsed_days: 0,
        remaining_days: 0,
    });

    const set_title = (value: string) => {
        set_new_Issue({...new_Issue, title: value});
    }
    const set_system_tags = (tags: string[]) => {
        set_new_Issue({...new_Issue, system_tags: tags});
    }
    const set_error_source_tags = (tags: string[]) => {
        set_new_Issue({...new_Issue, error_source_tags: tags});
    }
    const set_error_category_tags = (tags: string[]) => {
        set_new_Issue({...new_Issue, error_category_tags: tags});
    }
    const set_ticket_id = (value: string) => {
        set_new_Issue({...new_Issue, ticket_id: value});
    }
    const set_sa_url = (value: string) => {
        set_new_Issue({...new_Issue, ticket_link: value});
    }
    const set_due_date = (value: Dayjs) => {
        set_new_Issue({...new_Issue, due_date: value});
    }

    const set_comment = (value: string) => {
        set_new_Issue({...new_Issue, comments: [{date: dayjs(), comment: value}]});
    }

    const tags: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Systems',
            children: <EmanagerTag tags={new_Issue.system_tags} setTags={set_system_tags}/>
        },
        {
            key: '2',
            label: 'Error Source',
            children: <EmanagerTag tags={new_Issue.error_source_tags} setTags={set_error_source_tags}/>
        },
        {
            key: '3',
            label: 'Error Category',
            children: <EmanagerTag tags={new_Issue.error_category_tags} setTags={set_error_category_tags}/>
        }
    ]
    const sa_informations: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Ticket ID',
            children: <Paragraph editable={{ onChange: set_ticket_id }}>{new_Issue.ticket_id}</Paragraph>
        },
        {
            key: '2',
            label: 'Link',
            children: <Link href={new_Issue.ticket_link} target="_blank">
                <Paragraph editable={{ onChange: set_sa_url }}>{new_Issue.ticket_link}</Paragraph>
            </Link>
        },
        {
            key: '3',
            label: 'Due Date',
            children: <DatePicker onChange={set_due_date} defaultValue={new_Issue.due_date} />
        } 
    ]


    return(
        <div>
            <Row style={{ marginBottom: 48 }}>
                <Typography.Title editable={{ onChange: set_title }} level={1} style={{ marginBottom: 12 }}>
                    {new_Issue.title}
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
                    <Button type='primary' icon={<PlusSquareOutlined/>} onClick={() => { addIssue(new_Issue) }}>
                        Update Investigation Status
                    </Button>
                </Col>
            </Row>
        </div>
    )
}