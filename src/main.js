import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuex from 'vuex'
import axios from "axios";
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuex)

Vue.use(Vuetify)


const catchError = () => { return false }

const store = new Vuex.Store({
  state: {
    user: false
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    }
  },
  actions: {
    async getUser(context) {
      // store.dispatch("login", {email: "test", password: "123"});
      const response = await axios.get("/user").catch(catchError)
      context.commit("setUser", response?.data)
    },
    async login(context, { email, password }) {
      return await axios.post("/user/login", { email, password }).catch(catchError)
    },
    async register(context, { email, password }) {
      return await axios.post("/user/register", { email, password }).catch(catchError)
    },
    async logout() {
      return await axios.post("/user/logout").catch(catchError)
    },
    async createPost(context, { title, content }) {
      return await axios.post("/news/admin/create", { title, content }).catch(catchError)
    },
    async deletePost(context, postID) {
      return await axios.post("/news/admin/delete", { postID }).catch(catchError)
    },
    async getPostList() {
      return await axios.get("/news/list").catch(catchError)
    },
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify: new Vuetify({}),
  render: h => h(App)
}).$mount('#app')
