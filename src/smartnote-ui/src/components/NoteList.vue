<template>
  <div class="note-list">
    <div class="header">
      <h2>Notes</h2>
      <button @click="showAddNoteForm">Add New Note</button>
    </div>
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Content</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="note in notes" :key="note.id">
          <td data-label="Title" @click="editNote(note)">{{ note.title }}</td>
          <td class="hide-on-mobile" data-label="Content" @click="editNote(note)">
            {{ note.content.length > 50 ? note.content.replace(/\s+/g, ' ').substring(0, 50) + '...' : note.content }}
          </td>
          <td class="show-on-mobile" data-label="Content" @click="editNote(note)">
            {{ note.content.length > 20 ? note.content.replace(/\s+/g, ' ').substring(0, 20) + '...' : note.content }}
          </td>
          <td data-label="Actions">
            <button class="delete-button" @click.stop="confirmDelete(note.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="showForm || editingNote" class="modal">
      <div class="modal-content">
        <note-form :editingNote="editingNote" @note-added="handleNoteSaved" @note-updated="handleNoteSaved"
          @edit-cancelled="cancelEdit" />
      </div>
    </div>
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <p>Are you sure you want to delete this note?</p>
        <button @click="deleteNote">Yes</button>
        <button @click="cancelDelete">No</button>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from "@/utils/axiosInstance";
import NoteForm from "./NoteForm.vue";

export default {
  components: {
    NoteForm,
  },
  data() {
    return {
      notes: [],
      editingNote: null,
      showForm: false,
      showDeleteModal: false,
      noteToDelete: null,
    };
  },
  methods: {
    async fetchNotes() {
      const response = await axiosInstance.get(`/note/all`);
      this.notes = response.data;
    },
    confirmDelete(id) {
      this.noteToDelete = id;
      this.showDeleteModal = true;
    },
    async deleteNote() {
      await axiosInstance.delete(`/note/${this.noteToDelete}`);
      this.showDeleteModal = false;
      this.noteToDelete = null;
      this.fetchNotes();
    },
    cancelDelete() {
      this.showDeleteModal = false;
      this.noteToDelete = null;
    },
    editNote(note) {
      this.editingNote = { ...note };
      this.showForm = true;
    },
    showAddNoteForm() {
      this.editingNote = null;
      this.showForm = true;
    },
    cancelEdit() {
      this.editingNote = null;
      this.showForm = false;
    },
    handleNoteSaved() {
      this.fetchNotes();
      this.cancelEdit();
    },
    refreshNotes() {
      this.fetchNotes();
    }
  },
  mounted() {
    this.fetchNotes();
  },
};
</script>

<style scoped>
@import '../assets/Theme.css';

.note-list {
  background-color: var(--primary-color);
  color: var(--text-color);
  padding: 20px;
  border-radius: 8px;
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.note-list .header button {
  background-color: var(--accent-color);
  font-weight: bold;
  color: var(--primary-color);
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.note-list .header button:hover {
  background-color: var(--link-hover-color);
  color: var(--primary-color);
}

.note-list table {
  width: 100%;
  border-collapse: collapse;
}

.note-list th,
.note-list td {
  padding: 10px;
  border: 1px solid var(--border-color);
  vertical-align: top;
  display: table-cell;
}

.note-list th {
  background-color: var(--secondary-color);
}

.note-list td {
  background-color: var(--secondary-color);
  color: #fff;
}

.note-list tr {
  display: table-row;
  /* Ensure all rows have the same height */
}

.note-list tr.completed td {
  text-decoration: line-through;
  color: #888;
}

.note-list td button {
  width: 100%;
  background-color: var(--primary-color);
  color: var(--text-color);
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.note-list td button:hover {
  background-color: var(--bg-color);
  color: var(--text-color);
}

.checkbox-cell {
  text-align: center;
}

.checkbox-cell input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  width: 80%;
  background: var(--primary-color);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
}

.modal-content button {
  background-color: var(--accent-color);
  color: var(--primary-color);
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 10px;
  font-weight: bold;
}

.modal-content button:hover {
  background-color: var(--link-hover-color);
}

/* Responsive styling */
@media (max-width: 600px) {
  .note-list .hide-on-mobile {
    display: none;
  }

  .note-list .show-on-mobile {
    display: table-cell;
  }
}

@media (min-width: 601px) {
  .note-list .show-on-mobile {
    display: none;
  }
}
</style>
