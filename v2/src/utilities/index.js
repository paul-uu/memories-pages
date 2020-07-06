import { emotions3 } from '../constants/constants.js';

export const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

export const getEmotionPercentages = (emotions) => {
  let total = 0;
  for (let emotion in emotions) {
    total += emotions[emotion];
  }

  let percentages = {};
  for (let emotion in emotions) {
    percentages[emotion] = Math.floor((emotions[emotion] / total) * 100); 
  }

  // update to only include emotions with percentages > 0

  return percentages;
}

export const getEmotionGradients = (emotions) => {

  console.log(emotions);
  console.log(getEmotionPercentages(emotions));

  let output = '';

  if (!hasMultipleEmotions(emotions)) {
    //let emotion = 
    //const color = 
    //return ''
    // output += 'linear-gradient(to bottom, ';
  }


  return output += ');'; // end css string

  function hasMultipleEmotions(emotions) {
    let emotionPercentages = getEmotionPercentages(emotions);
    for (let emotion in emotionPercentages) {
      if (emotionPercentages[emotion] === 100 ) 
        return false
    }
    return true;
  }
}