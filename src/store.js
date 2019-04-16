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
		}
	},
	actions: {
		register({ commit }, user) {
			return new Promise((resolve, reject) => {
				commit('auth_request');
				axios
					.post('/create/register', {
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
					.post('/read/login', {
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
		}
	}
});

/* modules: {
	// 	auth: {
	// 		namespaced: true,
	// 		state: {
	// 			registerUsername: '',
	// 			registerEmail: '',
	// 			registerPassword: '',
	// 			registerErrorMessage: null,
	// 			registerErrorType: null
	// 		},
	// 		actions: {
	// 			logout({ commit }) {
	// 				commit('setToken', null);
	// 				localStorage.removeItem('token');
	// 				delete axios.defaults.headers.common['Authorization'];
	// 				router.push('/');
	// 			},
	// 			register({ commit, state }) {
	// 				commit('setRegisterErrorMessage', null);
	// 				commit('setRegisterErrorType', null);
	// 				return axios
	// 					.post('/create/register', {
	// 						username: state.registerUsername,
	// 						email: state.registerEmail,
	// 						password: state.registerPassword
	// 					})
	// 					.then(({ data }) => {
	// 						// save token in localstorage
	// 						commit('setToken', data.token);
	// 						localStorage.setItem('token', data.token);
	// 						axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
	// 						commit('setRegisterUsername', '');
	// 						commit('setRegisterEmail', '');
	// 						commit('setRegisterPassword', '');
	// 						router.push('/');
	// 					})
	// 					.catch(() => {
	// 						localStorage.removeItem('token');
	// 						commit('setRegisterErrorMessage', "Une erreur s'est produite, réessayer plus tard");
	// 						commit('setRegisterErrorType', 'danger');
	// 					});
	// 			},
	// 			login({ commit, state }) {
	// 				commit('setLoginErrorMessage', null);
	// 				commit('setLoginErrorType', null);
	// 				return axios
	// 					.post('/read/login', {
	// 						email: state.loginEmail,
	// 						password: state.loginPassword
	// 					})
	// 					.then(({ data }) => {
	// 						// save token in localstorage
	// 						commit('setToken', data.token);
	// 						localStorage.setItem('token', data.token);
	// 						axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
	// 						// redirect to user home
	// 						commit('setLoginEmail', '');
	// 						commit('setLoginPassword', '');
	// 						router.push('/');
	// 					})
	// 					.catch(() => {
	// 						localStorage.removeItem('token');
	// 						commit('setLoginErrorMessage', "Une erreur s'est produite, réessayer plus tard");
	// 						commit('setLoginErrorType', 'danger');
	// 					});
	// 			}
	// 		},
	// 		getters: {
	// 			isLoggedIn(state) {
	// 				return !!state.token;
	// 			}
	// 		},
	// 		mutations: {
	// 			setToken(state, token) {
	// 				state.token = token;
	// 			},
	// 			setUser(state, user) {
	// 				state.user = user;
	// 			},
	// 			setRegisterErrorMessage(state, message) {
	// 				state.registerErrorMessage = message;
	// 			},
	// 			setRegisterErrorType(state, type) {
	// 				state.registerErrorType = type;
	// 			},
	// 			setRegisterUsername(state, username) {
	// 				state.registerUsername = username;
	// 			},
	// 			setRegisterEmail(state, email) {
	// 				state.registerEmail = email;
	// 			},
	// 			setRegisterPassword(state, password) {
	// 				state.registerPassword = password;
	// 			},
	// 			setLoginErrorMessage(state, message) {
	// 				state.loginErrorMessage = message;
	// 			},
	// 			setLoginErrorType(state, type) {
	// 				state.loginErrorType = type;
	// 			},
	// 			setLoginEmail(state, email) {
	// 				state.loginEmail = email;
	// 			},
	// 			setLoginPassword(state, password) {
	// 				state.loginPassword = password;
	// 			}
	// 		}
	// 	}
	// },*/
