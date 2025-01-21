<template>
  <div class="note-form">
    <h2>{{ editingNote ? "Edit Note" : "Add a New Note" }}</h2>
    <form @submit.prevent="saveNote">
      <input v-model="note.title" placeholder="Title" required />
      <textarea v-model="note.content" placeholder="Content"></textarea>
      <div class="form-buttons">
        <button type="submit">{{ editingNote ? "Update Note" : "Add Note" }}</button>
        <button type="button" @click="cancelEdit">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
import axiosInstance from "@/utils/axiosInstance";

export default {
  props: {
    editingNote: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      note: this.editingNote ? { ...this.editingNote } : {
        title: "",
        content: "",
      },
    };
  },
  watch: {
    editingNote(newVal) {
      this.note = newVal ? { ...newVal } : {
        title: "",
        content: "",
      };
    },
  },
  methods: {
    async saveNote() {
      if (this.editingNote) {
        await axiosInstance.put(`/note/${this.note.id}`, this.note);
        this.$emit("note-updated");
      } else {
        const newNote = {
          ...this.note,
        };
        await axiosInstance.post(`/note`, newNote);
        this.$emit("note-added");
      }

      this.cancelEdit();
    },
    cancelEdit() {
      this.$emit("edit-cancelled");
      this.resetForm();
    },
    resetForm() {
      this.note = {
        title: "",
        content: "",
        dueDate: "",
        status: "active",
      };
    },
  },
};
</script>

<style scoped>
@import '../assets/Theme.css';

.note-form h2 {
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
}

.note-form input,
.note-form textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--secondary-color);
  color: var(--text-color);
  box-sizing: border-box;
  font-size: 1rem;
}

.note-form textarea {
  resize: vertical;
  min-height: 200px;
}

.note-form input::placeholder,
.note-form textarea::placeholder {
  color: var(--placeholder-color);
}

.form-buttons {
  display: flex;
  justify-content: space-between;
}

.note-form button {
  background-color: var(--accent-color);
  color: var(--primary-color);
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  flex: 1;
  margin: 5px;
}

.note-form button:hover {
  background-color: var(--link-hover-color);
}

/* Responsive styling */
@media (max-width: 600px) {

  .note-form input,
  .note-form textarea {
    padding: 5px;
    font-size: 0.9rem;
  }

  .form-buttons {
    flex-direction: column;
  }

  .note-form button {
    margin: 5px 0;
  }
}
</style>
