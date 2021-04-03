export interface IMemory {
  id: string;
  dateTime: number;
  title: string;
  description: string; // rename to description
  media: {
    audio?: string | undefined;
    image?: string | undefined;
    video?: string | undefined;
  };
  isCoreMemory: boolean;
  emotions: {
    [key: string]: { percentage: number; value: number };
    /* todo: add these w/o ts errors
    anger  : { percentage: number, value: number };
    disgust: { percentage: number, value: number };
    fear   : { percentage: number, value: number };
    joy    : { percentage: number, value: number };
    neutral: { percentage: number, value: number };
    sadness: { percentage: number, value: number };
    */
  };
  gradient: {
    default: string;
    moz?: string;
    webkit?: string;
  };
}

export interface Emotion {
  label: string;
  color: string;
}

export interface IAction {
  type: string;
  data: {
    type: string;
    memory: IMemory;
  };
}
