import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home
		},
		{
			path: '/auth/inscription',
			name: 'inscription',
			// route level code-splitting
			// this generates a separate chunk (about.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import(/* webpackChunkName: "about" */ './views/auth/Inscription.vue')
		},
		{
			path: '/auth/connexion',
			name: 'connexion',
			component: () => import('./views/auth/Connexion.vue')
		},
		{
			path: '/compte/profile',
			name: 'profile',
			component: () => import('./views/compte/Profile.vue')
		},
		{
			path: '/compte/parametres',
			name: 'parametres',
			component: () => import('./views/compte/Parametres.vue')
		}
	]
});
