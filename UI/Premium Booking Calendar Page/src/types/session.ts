export type SessionType = 'career' | 'technical' | 'interview';

export interface Session {
  id: string;
  mentorName: string;
  mentorPhoto: string;
  studentName: string;
  studentPhoto: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: SessionType;
  notes: string;
  status: 'scheduled' | 'completed' | 'canceled';
}
