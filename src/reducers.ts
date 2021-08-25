import { createContext } from 'react';
import { actions } from './constants/constants';
import { IMemory, IAction } from './constants/interfaces';

const memoriesReducer = (state: IMemory[], action: IAction): IMemory[] => {
  const index = getMemoryIndex(state, action.data.memory);
  const { memory } = action.data;

  switch (action.type) {
    case actions.SET:
      let copy = [...state];
      if (index > -1) {
        copy = copy.map((m) => (m.id === memory.id ? memory : m));
      } else {
        copy.push(memory);
      }
      return copy;

    case actions.DELETE:
      return state.filter((m) => m.id !== memory.id);

    default:
      return state;
  }
};

const getMemoryIndex = (arr: IMemory[], memory: IMemory) => {
  for (let i = 0; i < arr.length; i++) {
    if (memory.id === arr[i].id) return i;
  }
  return -1;
};

export default memoriesReducer;
