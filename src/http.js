import axios from 'axios';
import store from '@/store/';

export default () => {
	return axios.create({
		baseURL: 'http://127.0.0.1:3333/',
		timeout: 5000,
		headers: {
			Authorization: `Bearer ${store.state.auth.token}`
		}
	});
};
