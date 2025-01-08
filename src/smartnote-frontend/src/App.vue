<template>
  <div id="app">
    <header>
      <nav>
        <h1>SmartNote</h1>
        <ul>
          <li><router-link to="/">Notes</router-link></li>
          <li><router-link to="/ai">AI Assistant</router-link></li>
        </ul>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <p>© 2025 SmartNote.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
@import './assets/Theme.css';

body {
  font-family: "Roboto", Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: var(--bg-color);
  color: var(--text-color);
  overflow-y: scroll;
  /* Always show scrollbar */
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Header styling */
header {
  background-color: var(--primary-color);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

header h1 {
  color: var(--accent-color);
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  text-align: center;
}

nav ul {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  border-bottom: 2px solid var(--border-color);
}

nav li {
  margin-left: 1.5rem;
  margin-right: 1.5rem;
}

nav a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease, color 0.3s ease;
  padding: 0.5rem 1rem;
  display: block;
  border-radius: 4px 4px 0 0;
}

nav a:hover,
nav a.router-link-exact-active {
  background-color: var(--accent-color);
  color: var(--primary-color);
}

/* Main content styling */
main {
  flex: 1;
  padding: 2rem;
  background-color: var(--secondary-color);
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  margin: 1rem;
}

/* Footer styling */
footer {
  background-color: var(--primary-color);
  color: var(--text-color);
  text-align: center;
  padding: 1rem 0;
  font-size: 0.9rem;
  border-top: 1px solid var(--border-color);
}

/* Responsive styling */
@media (max-width: 600px) {
  header {
    padding: 0.5rem;
  }

  header h1 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  nav li {
    margin: 0.5rem 0;
  }

  main {
    padding: 1rem;
    margin: 0.5rem;
  }
}
</style>
