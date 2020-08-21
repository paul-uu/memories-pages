import { useState } from 'react';

function useError() {
  const [errors, setErrors] = useState([]);
  return [errors, setErrors];
}

export default useError;
