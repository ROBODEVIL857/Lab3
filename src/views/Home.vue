<template>
  <v-container>
    <h1>Список новостей</h1>
    <v-container v-for="({ title, content }, key) in list" :key="key">
      <v-card hover>
        <v-card-title>
          {{ title }}

          <v-spacer />
          <v-btn
            v-if="user && user.isAdmin"
            color="error"
            @click="deletePost(key)"
          >
            <v-icon> mdi-trash-can </v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text style="white-space: pre-line" class="text-left">
          {{ content }}
        </v-card-text>
      </v-card>
    </v-container>
  </v-container>
</template>

<script>
import Vue from "vue";
export default {
  name: "Home",
  data() {
    return {
      list: [],
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    async deletePost(id) {
      if (!(await this.$store.dispatch("deletePost", this.list[id]._id))) {
        return;
      }
      Vue.delete(this.list, id);
    },
  },
  async created() {
    this.list = (await this.$store.dispatch("getPostList"))?.data || [];
    console.log(this.list);
  },
};
</script>