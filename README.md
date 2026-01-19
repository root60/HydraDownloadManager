![Hydra Download Manager Banner](https://i.postimg.cc/mRctx4Yn/HDM.png)

# Hydra Download Manager (HDM)

Hydra Download Manager (HDM) is a modern, lightweight, and fast download manager built with **TypeScript**, **Vite**, and a component-based frontend architecture. The project focuses on simplicity, performance, and extensibility, providing a clean UI and a solid foundation for advanced download management features.

---

## ✨ Features

- ⚡ Fast development with **Vite**
- 🧩 Modular component-based structure
- 📦 Dependency-managed with **npm**
- 🌐 Modern frontend stack (TypeScript + HTML)
- 🔧 Easy local setup and customization

---

## 📁 Project Structure

```
hydra-download-manager/
│
├── components/        # UI components
├── services/          # Core services & logic
├── App.tsx            # Root application component
├── index.html         # HTML entry point
├── index.tsx          # App bootstrap
├── types.ts           # Shared TypeScript types
│
├── .env.local         # Environment variables (local)
├── package.json       # Project metadata & scripts
├── tsconfig.json      # TypeScript configuration
├── vite.config.ts     # Vite configuration
└── README.md          # Project documentation
```

---

## 🧰 Prerequisites

Before running this project locally, make sure you have:

- **Node.js** (LTS version recommended)
- **npm** (comes with Node.js)

Verify installation:

```bash
node -v
npm -v
```

---

## 🚀 Run Locally

### 1️⃣ Clone the repository

```bash
git clone https://github.com/root60/HydraDownloadManager.git
cd HydraDownloadManager
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure environment variables

Create or edit the `.env.local` file:

```env
GEMINI_API_KEY=your_api_key_here
```

> ⚠️ Do not commit `.env.local` to version control.

### 4️⃣ Start the development server

```bash
npm run dev
```

Open your browser and navigate to:

```
http://localhost:5173
```

---

## 📦 Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## 🛠️ Scripts

| Command | Description |
|-------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## 📄 License

This project is open-source and available under the **MIT License**.

---

## ⭐ Acknowledgements

- Built with ❤️ using **Vite** and **TypeScript**
- Inspired by modern download manager workflows

---

If you find this project useful, consider giving it a ⭐ on GitHub!