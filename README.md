# 📚 XOX Book Tracker | Personal Library Manager

![Project Banner](https://via.placeholder.com/1000x400/1e1b4b/a5f3fc?text=XOX+Book+Tracker+Preview)

## 🚀 Live Demo
**View the live application:** [https://xox-book-tracker.vercel.app](https://xox-book-tracker.vercel.app)

---

## 🛠️ The Project
XOX Book Tracker is a high-performance React application designed for modern readers. It moves away from generic "to-do list" styles, opting for an **immersive 3D dark-mode aesthetic**. This project demonstrates mastery of the React lifecycle, asynchronous API handling, and advanced CSS layout techniques.

### 🌟 Key Features
- **Global Book Search:** Direct integration with the **OpenLibrary API** to fetch metadata for millions of titles.
- **3D Interactive UI:** Custom-engineered 3D CSS animations for a "tumbling book" mascot and glassmorphic UI layers.
- **Persistent Storage:** Full implementation of **LocalStorage API** to ensure user collections persist across browser sessions.
- **Performance Optimized:** Custom **Debounce Logic** implemented in the search hook to minimize API rate-limiting and improve UX.
- **Mobile-First Design:** A fully responsive, "sticky" navigation and footer system tailored for one-handed mobile use.

## 💻 Tech Stack
- **Library:** React.js (Functional Components & Hooks)
- **Styling:** CSS3 (3D Transforms, Flexbox, Grid, Backdrop-Filters)
- **API:** OpenLibrary REST API
- **Deployment:** Vercel (CI/CD Pipeline)

## 🏗️ Architecture & Logic
This project focuses on clean, modular code:
- **`App.js`**: Orchestrates state management and persistent logic.
- **`Search.jsx`**: Handles complex input states and debounced fetching.
- **`MyBookShelf.jsx`**: Manages the CRUD logic (Create, Read, Update, Delete) for the user's collection.

## 🔧 Installation & Setup
1. Clone the repo:
   ```bash
   git clone [https://github.com/mesudxox/your-repo-name.git](https://github.com/mesudxox/your-repo-name.git)