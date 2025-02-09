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

- **Container-Presenter Pattern**: Follows the Container-Presenter design pattern to separate data fetching logic from UI rendering logic.
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

## **Container-Presenter Design Pattern**

To maintain a clean separation of concerns, we follow the Container-Presenter design pattern:

- **Container Component**: Responsible for data fetching, state management, and business logic.
- **Presenter Component**: Responsible for rendering the UI based on the props passed from the Container component.

### Example

1. **Container Component** (`ScheduleListContainer.tsx`):

   ```tsx
   import React, { useEffect, useState } from "react";
   import { useTranslation } from "react-i18next";
   import { getScheduleList } from "../SchedulingApi";
   import { Schedule } from "../models/Schedule";
   import ScheduleListPresenter from "./ScheduleListPresenter";

   const ScheduleListContainer: React.FC = () => {
     const { t } = useTranslation("scheduleList");
     const [schedules, setSchedules] = useState<Schedule[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     useEffect(() => {
       const loadData = async () => {
         try {
           const data = await getScheduleList();
           setSchedules(data);
         } catch (err) {
           console.error(err);
           setError(t("error"));
         } finally {
           setLoading(false);
         }
       };

       loadData();
     }, [t]);

     return (
       <ScheduleListPresenter
         loading={loading}
         error={error}
         schedules={schedules}
       />
     );
   };

   export default ScheduleListContainer;
   ```

2. **Presenter Component** (`ScheduleListPresenter.tsx`):

   ```tsx
   import React from "react";
   import { useTranslation } from "react-i18next";
   import { Schedule } from "../models/Schedule";

   interface ScheduleListPresenterProps {
     loading: boolean;
     error: string | null;
     schedules: Schedule[];
   }

   const ScheduleListPresenter: React.FC<ScheduleListPresenterProps> = ({
     loading,
     error,
     schedules,
   }) => {
     const { t } = useTranslation("scheduleList");

     if (loading) return <p>{t("loading")}</p>;
     if (error) return <p>{error}</p>;
     if (schedules.length === 0) return <p>{t("noData")}</p>;

     return (
       <div>
         <h1>{t("scheduleListHeading")}</h1>
         <ul>
           {schedules.map((schedule) => (
             <li key={schedule.id}>
               <strong>{schedule.examName}</strong> - {schedule.date} at{" "}
               {schedule.location}
             </li>
           ))}
         </ul>
       </div>
     );
   };

   export default ScheduleListPresenter;
   ```

---

## **Conclusion**

This setup integrates the **QM.Scheduling** React application into the .NET 8 API. It displays an online exam schedule list, supports JWT authentication, and includes multi-language support with translations.

---

## **Enjoy building your Scheduling Application!** 🗓️✨

---
