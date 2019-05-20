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
			path: '/admin/documents',
			name: 'admin documents',
			component: () => import('./views/managment/admin/Documents.vue')
		},
		{
			path: '/admin/users',
			name: 'admin users',
			component: () => import('./views/managment/admin/Users.vue')
		},
		{
			path: '/admin/certificats',
			name: 'admin certificats',
			component: () => import('./views/managment/admin/Certificats.vue')
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
		},
		{
			path: '/documents/exos',
			name: 'exos',
			component: () => import('./views/document/Exos.vue')
		},
		,
		{
			path: '/documents/cours',
			name: 'cours',
			component: () => import('./views/document/Cours.vue')
		},
		{
			path: '/search',
			name: 'search',
			component: () => import('./views/Search.vue')
		}
	]
});
