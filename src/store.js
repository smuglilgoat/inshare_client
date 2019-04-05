import Vue from 'vue';
import Vuex from 'vuex';
import router from '@/router';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		auth: {
			namespaced: true,
			state: {
				registerUsername: '',
				registerEmail: '',
				registerPassword: '',
				registerErrorMessage: null,
				registerErrorType: null,
				loginEmail: '',
				loginPassword: '',
				loginErrorMessage: null,
				loginErrorType: null,
				token: localStorage.getItem('token') || null
			},
			actions: {
				logout({ commit }) {
					commit('setToken', null);
					localStorage.removeItem('token');
					delete axios.defaults.headers.common['Authorization'];
					router.push('/');
				},
				register({ commit, state }) {
					commit('setRegisterErrorMessage', null);
					commit('setRegisterErrorType', null);
					return axios
						.post('/auth/register', {
							username: state.registerUsername,
							email: state.registerEmail,
							password: state.registerPassword
						})
						.then(({ data }) => {
							// save token in localstorage
							commit('setToken', data.token);
							localStorage.setItem('token', data.token);
							axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
							commit('setRegisterUsername', '');
							commit('setRegisterEmail', '');
							commit('setRegisterPassword', '');
							router.push('/');
						})
						.catch(() => {
							localStorage.removeItem('token');
							commit('setRegisterErrorMessage', "Une erreur s'est produite, réessayer plus tard");
							commit('setRegisterErrorType', 'danger');
						});
				},
				login({ commit, state }) {
					commit('setLoginErrorMessage', null);
					commit('setLoginErrorType', null);
					return axios
						.post('/auth/login', {
							email: state.loginEmail,
							password: state.loginPassword
						})
						.then(({ data }) => {
							// save token in localstorage
							commit('setToken', data.token);
							localStorage.setItem('token', data.token);
							axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
							// redirect to user home
							commit('setLoginEmail', '');
							commit('setLoginPassword', '');
							router.push('/');
						})
						.catch(() => {
							localStorage.removeItem('token');
							commit('setLoginErrorMessage', "Une erreur s'est produite, réessayer plus tard");
							commit('setLoginErrorType', 'danger');
						});
				}
			},
			getters: {
				isLoggedIn(state) {
					return !!state.token;
				}
			},
			mutations: {
				setToken(state, token) {
					state.token = token;
				},
				setRegisterErrorMessage(state, message) {
					state.registerErrorMessage = message;
				},
				setRegisterErrorType(state, type) {
					state.registerErrorType = type;
				},
				setRegisterUsername(state, username) {
					state.registerUsername = username;
				},
				setRegisterEmail(state, email) {
					state.registerEmail = email;
				},
				setRegisterPassword(state, password) {
					state.registerPassword = password;
				},
				setLoginErrorMessage(state, message) {
					state.loginErrorMessage = message;
				},
				setLoginErrorType(state, type) {
					state.loginErrorType = type;
				},
				setLoginEmail(state, email) {
					state.loginEmail = email;
				},
				setLoginPassword(state, password) {
					state.loginPassword = password;
				}
			}
		}
	},
	state: {},
	mutations: {},
	actions: {}
});
