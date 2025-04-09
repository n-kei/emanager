import React from "react"
import { Row, Col, Statistic } from 'antd';
import { DatePicker } from 'antd';
import { Line, Pie } from '@ant-design/plots';
import { IssueType, ProgressTypeEnum } from "../../types";
import dayjs, { Dayjs } from 'dayjs';
import { Typography } from 'antd';

const { Title } = Typography;

export const DashboardPage: React.FC<{issues: IssueType[]}> = ({issues}) => {
    const overdue_tasks = issues.filter(issue => issue.remaining_days <= 0).length;
    const close_deadline_tasks = issues.filter(issue => issue.remaining_days > 0 && issue.remaining_days < 7).length;
    const abandoned_tasks = issues.filter(issue => issue.progress === ProgressTypeEnum.New && issue.elapsed_days >= 7).length;

    const [start_date, set_start_date] = React.useState<Dayjs>(dayjs().add(-7, 'day'));
    const [end_date, set_end_date] = React.useState<Dayjs>(dayjs().add(7, 'day'));
    const handleDateChange = (dates: any) => {
        if (dates) {
            set_start_date(dates[0]);
        set_end_date(dates[1]);
        }
    };

    const burndown_period = end_date.diff(start_date, 'day') + 1;
    const issues_on_date = (date: Dayjs) => issues.filter(issue => {
        const start = issue.outage_date.isAfter(date) ? issue.outage_date : date;
        const end = issue.closed_date && issue.closed_date.isBefore(end_date) ? issue.closed_date : end_date;

        return start.isSame(date) || end.isSame(date) || (start.isBefore(date) && end.isAfter(date))
    }).length;
    const burndown_slope = issues_on_date(start_date) / burndown_period;

    const actual_effort = (new Array(burndown_period)).fill(0).map((_, i) => {
        const date = start_date.add(i, 'day');
        return ({
            date: date.format('YYYY-MM-DD'),
            issues: date.isAfter(dayjs()) ? null : issues_on_date(date),
            category: "Actual Effort",
        })
    });
    const ideal_effort = (new Array(burndown_period)).fill(0).map((_, i) => {
        const date = start_date.add(i, 'day');
        return ({
            date: date.format('YYYY-MM-DD'),
            issues: Math.max(0, burndown_slope * (burndown_period - i)),
            category: "Ideal Effort",
        })
    });

    const count_error_category = issues.reduce((acc, Issue) => {
        Issue.error_category_tags.forEach(tag => {
            acc[tag] = acc[tag] ? acc[tag] + 1 : 1;
        });
        return acc;
    }, {} as {[key: string]: number});
    const count_error_source = issues.reduce((acc, Issue) => {
        Issue.error_source_tags.forEach(tag => {
            acc[tag] = acc[tag] ? acc[tag] + 1 : 1;
        });
        return acc;
    }, {} as {[key: string]: number});

    const line_config = {
        title: 'Burndown chart',
        data: [...actual_effort, ...ideal_effort],
        xField: 'date',
        yField: 'issues',
        colorField: 'category',
        color: ['#ff6347', '#1e90ff'],
        axis: {
            x: {
                title: 'Date',
                label: {
                    formatter: (text: string) => dayjs(text).format('YYYY/MM/DD'),
                },
            },
            y: {
                title: 'Number of issues',
            }
        }
    };

    const pie_category_config = {
        title: 'Error category',
        data: Object.keys(count_error_category).map(key => ({type: key, value: count_error_category[key]})),
        angleField: 'value',
        colorField: 'type',
        label: {
            text: 'value',
            style: {
                fontWeight: 'bold',
            },
        },
        legend: {
            color: {
                title: false,
                position: 'right',
                rowPadding: 5,
            },
        },
    };

    const pie_source_config = {
        title: 'Error source',
        data: Object.keys(count_error_source).map(key => ({type: key, value: count_error_source[key]})),
        angleField: 'value',
        colorField: 'type',
        label: {
            text: 'value',
            style: {
                fontWeight: 'bold',
            },
        },
        legend: {
            color: {
                title: false,
                position: 'right',
                rowPadding: 5,
            },
        },
    };

    return (
        <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Statistic valueStyle={{ color: 'red' }} title='Overdue tasks' value={overdue_tasks} />
                </Col>
                <Col span={8}>
                    <Statistic valueStyle={{ color: 'orange' }} title='Tasks with close deadlines' value={close_deadline_tasks} />
                </Col>
                <Col span={8}>
                    <Statistic valueStyle={{ color : 'gold'}} title='Abandoned tasks' value={abandoned_tasks} />
                </Col>
            </Row>
            <Row style={{ marginBottom: 24 }}>
                <Col span={24}>
                    <Title level={4}>Burndown period</Title>
                </Col>
                <DatePicker.RangePicker
                    defaultValue={[start_date, end_date]}
                    onChange={handleDateChange}
                />
            </Row>
            <Row style={{ marginBottom: 24 }}>
                <Col span={24}>
                    <Line {...line_config} />
                </Col>
            </Row>
            <Row style={{ marginBottom: 24 }}>
                <Col span={12}>
                    <Pie {...pie_category_config} />
                </Col>
                <Col span={12}>
                    <Pie {...pie_source_config} />
                </Col>
            </Row>
        </div>
    )
}