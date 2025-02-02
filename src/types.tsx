import { Dayjs } from 'dayjs'

export interface IncidentType {
    key: string
    title: string
    system_tags: string[]
    error_source_tags: string[]
    error_category_tags: string[]
    progress: string
    ticket_id: string
    sa_url: string
    due_date: Dayjs
    priority: string
    elapsed_days: number
    remaining_days: number
    creation_date: Dayjs
    comments: { date: Dayjs, comment: string }[]
}

export type addIncidentType = (incident: IncidentType) => void
export type editIncidentType = (key: string, incident: IncidentType) => void
export type deleteIncidentType = (key: string) => void