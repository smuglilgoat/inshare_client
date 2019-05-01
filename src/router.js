import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home
		},
		{
			path: '/auth/register',
			name: 'register',
			// route level code-splitting
			// this generates a separate chunk (about.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import(/* webpackChunkName: "about" */ './views/auth/Register.vue')
		},
		{
			path: '/auth/login',
			name: 'login',
			component: () => import('./views/auth/Login.vue')
		},
		{
			path: '/profile',
			name: 'personal',
			component: () => import('./views/profile/Personal.vue')
		},
		{
			path: '/profile/:id',
			name: 'userprofile',
			component: () => import('./views/profile/UserProfile.vue')
		},
		{
			path: '/account',
			name: 'account',
			component: () => import('./views/managment/Account.vue')
		},
		{
			path: '/admin',
			name: 'administration',
			component: () => import('./views/managment/Admin.vue')
		},
		{
			path: '/upload',
			name: 'upload',
			component: () => import('./views/upload/Upload.vue')
		},
		{
			path: '/documents/view/:id',
			name: 'document',
			component: () => import('./views/document/Document.vue')
		},
		{
			path: '/documents/exams',
			name: 'exams',
			component: () => import('./views/document/Exams.vue')
		}
	]
});
