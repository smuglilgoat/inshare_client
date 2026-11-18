# inShare client

Front end of **inShare**, a community driven file sharing website. Built with Vue 2 and Vuetify.

See [inshare_api](https://github.com/smuglilgoat/inshare_api) for the AdonisJS API.

## What it does

A single-page app for browsing, searching and uploading shared course material:

- home, search and contact pages;
- registration and login, personal profile, public user profiles and account management;
- document pages by category (courses, exams, exercises), with comments, ratings and previews;
- upload flows for documents, images and videos, with tags;
- an admin area for documents, users and certificates.

Routes are declared in `src/router.js`; the API is called with `axios` from the components, and the JWT is kept in `localStorage`.

## Stack

- Vue 2.6, Vue Router 3, Vuex 3
- Vuetify 1.5, Material Design icons
- `axios`, `v-viewer`, `@voerro/vue-tagsinput`, `jszip`
- Vue CLI 3 build

## Getting started

```bash
npm install
npm run serve      # dev server with hot reload
npm run build      # production build
```

Before running, point `axios.defaults.baseURL` in `src/main.js` at a running instance of the API. The repository value is an old ngrok tunnel and is no longer reachable.

## Notes

- The API base URL and the `Authorization` header are configured in `src/main.js`.
- `package.json` only exposes `serve` and `build`; there is no test or lint script despite older documentation.
- This is a Vue 2 / Vuetify 1 codebase and pins the matching toolchain versions.
