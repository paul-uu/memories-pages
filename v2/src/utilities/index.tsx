import { emotions3 } from '../constants/constants.js';

export const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

export const isObjEmpty = (obj: object):boolean => Object.keys(obj).length === 0;

export const getEmotionPercentages = (emotions: any) => {
  let total = 0;
  for (let emotion in emotions) {
    total += emotions[emotion];
  }
  let percentages = {};
  for (let emotion in emotions) {
    // @ts-ignore
    percentages[emotion] = Math.floor((emotions[emotion] / total) * 100); 
  }
  // update to only include emotions with percentages > 0
  return percentages;
}


export const getEmotionGradients = (emotions: any) => {
  //console.log(emotions);
  //console.log(getEmotionPercentages(emotions));
  let output = '';
  if (!hasMultipleEmotions(emotions)) {
    //let emotion = 
    //const color = 
    //return ''
    // output += 'linear-gradient(to bottom, ';
  }
  return output += ');'; // end css string

  function hasMultipleEmotions(emotions: any) {
    let emotionPercentages = getEmotionPercentages(emotions);
    for (let emotion in emotionPercentages) {
      // @ts-ignore
      if (emotionPercentages[emotion] === 100 ) 
        return false
    }
    return true;
  }
}