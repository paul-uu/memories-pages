export const LOCALSTORAGEKEY = 'memoryCollectorData';

/* Need to consolodate these! */

export const emotions = {
  joy: 'joy',
  anger: 'anger',
  sadness: 'sadness',
  fear: 'fear',
  disgust: 'disgust',
  neutral: 'neutral',
};

export const emotions2 = [
  'joy',
  'anger',
  'sadness',
  'fear',
  'disgust',
  'neutral',
];

export const emotions3: {
  [index: string]: { label: string; color: string };
} = {
  joy: {
    label: 'joy',
    color: '#f5f317',
  },
  anger: {
    label: 'anger',
    color: '#db373e',
  },
  sadness: {
    label: 'sadness',
    color: '#5380be',
  },
  fear: {
    label: 'fear',
    color: '#c3648e',
  },
  disgust: {
    label: 'disgust',
    color: '#73c557',
  },
  neutral: {
    label: 'neutral',
    color: '#ddd',
  },
};

export const sortOptions = {
  new: {
    label: 'Newest',
    value: 'new',
  },
  old: {
    label: 'Oldest',
    value: 'old',
  },
  joy: {
    label: 'Joyful',
    value: emotions.joy,
  },
  anger: {
    label: 'Anger',
    value: emotions.anger,
  },
  sad: {
    label: 'Sadness',
    value: emotions.sadness,
  },
  fear: {
    label: 'Fearful',
    value: emotions.fear,
  },
  disgust: {
    label: 'Disgusting',
    value: emotions.disgust,
  },
  neutral: {
    label: 'Neutral',
    value: emotions.neutral,
  },
};

export const filterOptions = {
  all: {
    label: 'All',
    value: 'all',
  },
  joy: {
    label: 'Joy',
    value: emotions.joy,
  },
  anger: {
    label: 'Anger',
    value: emotions.anger,
  },
  sad: {
    label: 'Sad',
    value: emotions.sadness,
  },
  fear: {
    label: 'Fearful',
    value: emotions.fear,
  },
  disgust: {
    label: 'Disgusting',
    value: emotions.disgust,
  },
  neutral: {
    label: 'Neutral',
    value: emotions.neutral,
  },
  core: {
    label: 'Core Memories',
    value: 'core',
  },
};

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const actions = {
  SET: 'SET',
  DELETE: 'DELETE',
};
