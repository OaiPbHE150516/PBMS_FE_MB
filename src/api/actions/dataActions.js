import axios from 'axios';

export const fetchData = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('https://pbms-be-api-vqj42lqqmq-as.a.run.app/api/test/getAllAccount');
      dispatch({ type: 'SET_DATA', payload: response.data });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
};