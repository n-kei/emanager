import { UploadChangeParam } from 'antd/es/upload'
import { Dayjs } from 'dayjs'

export enum ProgressTypeEnum {
    New = 'New',   
    InProgress = 'In Progress',
    Resolved = 'Resolved',
    Closed = 'Closed'
}

export enum PriorityTypeEnum {
    High = 'High',
    Middle = 'Middle',
    Low = 'Low'
}

export interface IssueType {
    key: string
    title: string
    outage_date: Dayjs
    abstract: string
    statement: string
    workaround: string
    solution: string
    comments: { date: Dayjs, comment: string }[]

    progress: ProgressTypeEnum
    priority: PriorityTypeEnum
    system_tags: string[]
    error_source_tags: string[]
    error_category_tags: string[]
    ticket_id: string
    ticket_link: string
    due_date: Dayjs
    elapsed_days: number
    remaining_days: number
}

export type addIssueType = (Issue: IssueType) => void
export type addEmptyIssueType = () => string
export type editIssueType = (key: string, Issue: IssueType) => void
export type deleteIssueType = (key: string) => void
export type newIssuesType = () => void
export type saveIssuesType = () => void
export type loadIssuesType = (info: UploadChangeParam) => void