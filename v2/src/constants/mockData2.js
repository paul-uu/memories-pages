/* Updated Data Model
 * 
 * dateTime: Date Object // deconstruct at usage
 * text: string
 * media: { audio: string, image: string, video: string }
 * isCoreMemory: bool
 * emotions: { joy: number, ... } // use these valuses to construct gradient
 * 
 */

export default [
  {
    id: 123,
    dateTime: new Date(),
    text: "memory 1",
    media: { audio: "", image: "", video: "" },
    isCoreMemory: false,
    emotions: {
      joy: 5,
      anger: 0,
      sadness: 0,
      fear: 0,
      disgust: 3,
      neutral: 2
    }
  },
  {
    id: 1234,
    dateTime: new Date(),
    text: "memory 2",
    media: { audio: "", image: "", video: "" },
    isCoreMemory: true,
    emotions: {
      joy: 0,
      anger: 5,
      sadness: 2,
      fear: 2,
      disgust: 1,
      neutral: 0
    }
  }
];