<template>
  <NoteList ref="noteList" />
</template>

<script>
import NoteList from "../components/NoteList.vue";

export default {
  components: {
    NoteList
  },
  methods: {
    refreshNotes() {
      this.$refs.noteList.fetchNotes();
    },
  },
};
</script>
