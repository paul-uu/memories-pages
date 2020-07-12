
export interface Memory {
  id: string;
  dateTime: Date | undefined;
  text: string;
  media: {
    audio?: string | undefined;
    image?: string | undefined;
    video?: string | undefined;
  },
  isCoreMemory: boolean;
  emotions: {
    [key: string]: { percentage: number, value: number };
    /* todo: add these w/o ts errors
    anger  : { percentage: number, value: number };
    disgust: { percentage: number, value: number };
    fear   : { percentage: number, value: number };
    joy    : { percentage: number, value: number };
    neutral: { percentage: number, value: number };
    sadness: { percentage: number, value: number };
    */
  },
  gradients: {
    default: string;
    moz?: string;
    webkit?: string;
  }
}

export interface Emotion {
  label: string;
  color: string;
}