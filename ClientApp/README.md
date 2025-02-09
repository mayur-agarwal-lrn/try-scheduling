# **QM.Scheduling ClientApp**

This is the **React** application for **QM.Scheduling**, built using **Vite**, **TypeScript**, **SCSS**, and **i18n** for translations. The React app is integrated with a **.NET 8 API** and is served from **wwwroot** inside the API project.

---

## **Project Overview**

- **React App** built with **Vite**, **TypeScript**, and **SCSS**.
- **i18n translations** for multi-language support.
- Integrated with a **.NET 8 API** for backend services.
- **JWT authentication** for secure API requests.

---

## **Features**

### **React and Vite**

- **Fast Development**: Utilizes Vite for fast development and hot module replacement (HMR).
- **TypeScript**: Strongly typed code with TypeScript for better maintainability and fewer runtime errors.

### **Styling**

- **SCSS**: Uses SCSS for styling, allowing nested rules, variables, and mixins for more organized and reusable styles.

### **Internationalization (i18n)**

- **Multi-language Support**: Uses `react-i18next` and `i18next` for internationalization, supporting multiple languages.
- **Dynamic Language Switching**: Allows users to switch languages dynamically.

### **API Integration**

- **Axios**: Configured Axios for making API requests to the .NET backend.
- **Retry Logic**: Implements retry logic for API requests using `axios-retry`.
- **JWT Authentication**: Includes JWT token in API requests for secure communication.

### **State Management**

- **React Hooks**: Utilizes React hooks (`useState`, `useEffect`) for managing state and side effects.

### **Component Structure**

- **Modular Components**: Organized into reusable and modular components for better code management.
- **Schedule List**: Displays a list of exam schedules fetched from the backend API.

### **Build and Deployment**

- **Vite Build**: Configured to build the React app and output to the `.NET wwwroot` folder for seamless integration.
- **Bootstrapper**: Uses a bootstrapper script to dynamically load the React app using the Vite manifest.

---

## **Getting Started**

1. **Install Dependencies**: Run `npm install` to install all necessary packages.
2. **Build the App**: Run `npm run build` to build the React app.
3. **Run the .NET API**: Ensure the .NET API project is running to serve the React app from `wwwroot`.

---

## **Conclusion**

This setup integrates the **QM.Scheduling** React application into the .NET 8 API. It displays an online exam schedule list, supports JWT authentication, and includes multi-language support with translations.

---

## **Enjoy building your Scheduling Application!** 🗓️✨

---
