import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		status: '',
		token: localStorage.getItem('token') || null,
		user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}
	},
	getters: {
		isLoggedIn: (state) => !!state.token,
		isAdmin: (state) => !(state.user.role != 'Administrateur' && state.user.role != 'Moderateur'),
		authStatus: (state) => state.status,
		userAvatar: (state) => state.user.avatar,
		user: (state) => state.user
	},
	mutations: {
		auth_request(state) {
			state.status = 'loading';
		},
		auth_success(state, { token, user }) {
			state.status = 'success';
			state.token = token;
			state.user = user;
		},
		auth_error(state) {
			state.status = 'error';
		},
		logout(state) {
			state.status = '';
			state.token = '';
			state.user = {};
		},
		updateUser(state, user) {
			state.status = 'success';
			state.user = user;
		}
	},
	actions: {
		register({ commit }, user) {
			return new Promise((resolve, reject) => {
				commit('auth_request');
				axios
					.post('/auth/register', {
						username: user.username,
						email: user.email,
						password: user.password
					})
					.then((resp) => {
						const token = resp.data.token.token;
						const user = resp.data.user;
						localStorage.setItem('token', token);
						localStorage.setItem('user', JSON.stringify(user));
						axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
						commit('auth_success', { token, user });
						resolve(resp);
					})
					.catch((err) => {
						commit('auth_error', err);
						localStorage.removeItem('token');
						localStorage.removeItem('user');
						reject(err);
					});
			});
		},
		login({ commit }, user) {
			return new Promise((resolve, reject) => {
				commit('auth_request');
				axios
					.post('/auth/login', {
						email: user.email,
						password: user.password
					})
					.then((resp) => {
						const token = resp.data.token.token;
						const user = resp.data.user;
						localStorage.setItem('token', token);
						localStorage.setItem('user', JSON.stringify(user));
						axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
						commit('auth_success', { token, user });
						resolve(resp);
					})
					.catch((err) => {
						commit('auth_error');
						localStorage.removeItem('token');
						localStorage.removeItem('user');
						reject(err);
					});
			});
		},
		logout({ commit }) {
			return new Promise((resolve, reject) => {
				commit('logout');
				localStorage.removeItem('token');
				localStorage.removeItem('user');
				delete axios.defaults.headers.common['Authorization'];
				resolve();
			});
		},
		updateUser({ commit }, user) {
			return new Promise((resolve, reject) => {
				commit('updateUser', user.user);
				localStorage.removeItem('user');
				localStorage.setItem('user', JSON.stringify(user));
				resolve();
			});
		}
	}
});
