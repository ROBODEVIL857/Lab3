<template>
  <v-form>
    <v-card>
      <v-card-title> Создать новый пост </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              outlined
              clearable
              v-model="title"
              @keydown.enter="
                (e) => {
                  e.preventDefault();
                }
              "
            >
              <template v-slot:label> <h3>Заголовок</h3> </template>
            </v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-textarea outlined v-model="content">
              <template v-slot:label> <h3>Подробнее</h3> </template>
            </v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="green" elevation="2" text outlined @click="publish">
          Опубликовать
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
<script>
export default {
  name: "NewPost",
  async created() {
    if (!this.$store.state.user?.isAdmin) {
      this.$router.push("/");
    }
  },
  methods: {
    async publish() {
      await this.$store.dispatch("createPost", {
        title: this.title,
        content: this.content,
      });
      this.$router.push("/");
    },
  },
  data() {
    return {
      title: "",
      content: "",
    };
  },
};
</script>