import { useState } from 'react';
import { IncidentType } from './types';
import { addIncidentType, editIncidentType } from './types';
import dayjs from 'dayjs';
import { error } from 'console';
import { create } from 'domain';

const loadIncidents = () => {
  // TODO: remaining_daysの計算を追加する
  // TODO: elapsed_daysの計算を追加する
  /* ここにExcelからデータを吸い出してjsonの配列にまとめる処理を書く */
  /* 以下は動作確認用のダミーデータ */
  return [
    {
        key: '1',
        title: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        system_tags: ['xxxxxxxxxxxxxx'],
        error_source_tags: ['xxxxxxxxxxxxxx'],
        error_category_tags: ['xxxxxxxxxxxxxx'],
        ticket_id: '000000000',
        sa_url: 'https://www.google.com',
        due_date: dayjs('2025-01-01'),
        comments: [
          {date: dayjs('2025-01-01'), comment: 'BIOSエラー発生'}, 
          {date: dayjs('2025-01-02'), comment: 'BIOSエラー解消'}
        ],
        progress: 'New',
        priority: 'Middle',
        status: 'ok',
        elapsed_days: 30,
        remaining_days: 6,
        creation_date: dayjs('2025-01-01')
    },
    {
        key: '2',
        title: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        system_tags: ['xxxxxxxxxxxxxx'],
        error_source_tags: ['xxxxxxxxxxxxxx'],
        error_category_tags: ['xxxxxxxxxxxxxx'],
        ticket_id: '111111111',
        sa_url: 'https://www.google.com',
        due_date: dayjs('2025-01-02'),
        comments: [
          {date: dayjs('2025-01-10'), comment: 'PCIeエラー発生'}, 
          {date: dayjs('2025-01-11'), comment: 'エラー調査中'}
        ],
        progress: 'In Progress',
        priority: 'High',
        status: 'ng',
        elapsed_days: 10,
        remaining_days: -1,
        creation_date: dayjs('2025-01-11')
    }
  ]
}

export const saveIncidents = (incidents: IncidentType[]) => {
  /* ここにjsonの配列をExcelに書き出す処理を書く */
}

export const useIncidents = () => {
  const [incidents, setIncidents] = useState<IncidentType[]>(loadIncidents());

  const addIncident: addIncidentType = (incident: IncidentType) => {
    setIncidents([...incidents, incident]);
  }

  const editIncident: editIncidentType = (key: string, incident: IncidentType) => {
    setIncidents(incidents.map(i => i.key === key ? incident : i));
  }

  return [incidents, {addIncident, editIncident}] as const;

}