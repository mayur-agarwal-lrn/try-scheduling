# **Mock Scheduling Application**

This readme explains how we have set up **QM.Scheduling**, a **React** application using **Vite**, **TypeScript**, **SCSS**, and **translations** to display an **online exam schedule list**. The React app is integrated with a **.NET 8 API** and is served from **wwwroot** inside the API project.

## **Project Overview**

- **React App** built with **Vite**, **TypeScript**, and **SCSS**.
- **.NET 8 API** provides the exam schedule data.
- **JWT authentication** for API requests.
- **i18n translations** for multi-language support.
- **TenantId validation** for secure multi-tenant access.
- **Mobile-first approach** ensuring responsive design.
- **RTL language support** for right-to-left languages like Arabic.
- **Learnosity Design System (LDS)** components and dark theme from LDS.
- **Axios and @tanstack/react-query** for efficient data fetching and state management.
- **CSS Modules** for dynamically changing CSS class names to avoid conflicts with parent portal CSS.

## **Solution Structure**

- `QM.Scheduling.Api` — .NET 8 API project
- `ClientApp` — React project built with Vite

## **Prerequisites**

- **Node.js** and **npm**: Install from [nodejs.org](https://nodejs.org/)
- **.NET SDK**: Install from [dotnet.microsoft.com](https://dotnet.microsoft.com/download)
- **Visual Studio**: Install from [visualstudio.microsoft.com](https://visualstudio.microsoft.com/)

## **Steps to Build and Run the Project in Visual Studio**

### 1. **Create the Solution and Projects**

1. **Create a new .NET 8 Web API project (`QM.Scheduling.Api`)** using Visual Studio.
2. **Create a new React project (`ClientApp`)** in the same solution directory using Vite:
   - Open a terminal in the solution folder.
   - Run the following commands to create the React app:
     ```bash
     npm create vite@latest ClientApp -- --template react-ts
     cd ClientApp
     npm install
     ```
3. **Install the necessary packages in the `ClientApp`**:
   ```sh
   npm install sass
   npm install react-i18next i18next i18next-http-backend i18next-browser-languagedetector
   npm install axios @tanstack/react-query
   ```

### 2. **Configure the `csproj` File**

Add the following configuration in your `QM.Scheduling.Api.csproj` to build the React app during the .NET build or publish process:

- Define the path to the React project.
- Add a target to build the React app before the .NET build/publish.
- Include necessary package references.

For the actual code, refer to the file at:
`QM.Scheduling.Api/QM.Scheduling.Api.csproj`

### 3. **Update `Program.cs`**

Summary of changes in `Program.cs`:

- **Global Authorization Filter**: Enforce authentication by default.
- **JWT Authentication**: Configure JWT authentication with a custom handler.
- **Authorization Policies**: Define policies for schedule read and all permissions.
- **HTTPS Redirection**: Enforce HTTPS redirection.
- **HSTS**: Configure HTTP Strict Transport Security (HSTS).
- **Static Files**: Serve static files from the `wwwroot` folder.
- **Fallback Routing**: Handle fallback for client-side routing during development.
- **In-Memory Databases**: Configure in-memory databases for schedules and schedulers for demo purpose.

For the actual code, refer to the file at:
`QM.Scheduling.Api/Program.cs`

### 4. **Add CRUD Endpoints in Your .NET API**

1. **Create a Schedule model** in your .NET project.
2. **Add a SchedulesController** to handle CRUD operations for schedules.

### **Security of Endpoints**

- CRUD operations require appropriate permissions (`schedule:read`, `schedule:create`, `schedule:update`, `schedule:delete`).

### **Tenant-Based Route URL**

- The API endpoints are tenant-based and follow the URL pattern: `/scheduling/{tenantId}/api/schedules`.

### **Getting TenantId from Claims**

- The tenant ID is retrieved from the user's claims in the controller actions for demo purpose. This can also be done using TenantProvider from shared code.

For the actual code, refer to the files at:

- `QM.Scheduling.Api/Models/Schedule.cs`
- `QM.Scheduling.Api/Controllers/SchedulesController.cs`

## **Frontend (React) Configuration**

### 1. **Configure the React App for .NET Integration**

1. In `ClientApp`, modify `vite.config.ts` to integrate with the .NET API and generate a manifest file:
   - Configure the build output directory to `../QM.Scheduling.Api/wwwroot`.
   - The entry point will not be index.html in the src folder but main.tsx.
   - Enable the generation of the manifest file.
   - Inject the application version from `package.json` into the build.

For the actual code, refer to the file at:
`ClientApp/vite.config.ts`

### 2. **Customize the HTML Template (Fake Parent Portal)**

1. Delete index.html in the src folder and all CSS files.
2. Create `public/index.html` with your custom HTML.
3. It will have the scheduling-root div to host the React app.
4. Add a fake setup for the base URL.

For the actual code, refer to the file at:
`ClientApp/public/index.html`

**Note:** The `public/index.html` file sets up the base URL and refresh token in session storage or auth cookie to get the JWT token. In production, this will be done by the Parent Portal or Lobby to get the JWT token using an API call later. The fake token here, which we get from a fake API, expires in 60 seconds to test if we are making a token call after expiry or not.

### 3. **Create `bootstrapper.js`**

1. Create `public/bootstrapper.js` to dynamically load the React app using the Vite manifest.

For the actual code, refer to the file at:
`ClientApp/public/bootstrapper.js`

### 4. **Modify `main.tsx`**

1. Update `src/main.tsx` to render the React app inside the `scheduling-root` element. Most of the logic should be in `App.tsx` to keep `main.tsx` simple.

For the actual code, refer to the file at:
`ClientApp/src/main.tsx`

### 5. **Configure QueryClient**

1. Create a new file `src/api/reactQueryClient.ts` to configure the `QueryClient`.
2. The `QueryClient` is used to manage server state and handle API requests with retry logic.

For the actual code, refer to the file at:
`ClientApp/src/api/reactQueryClient.ts`

### 6. **Axios Configuration for Schedule Service**

1. Create a new file `src/api/axiosConfig.ts` to configure Axios.
2. The Axios configuration includes:
   - Setting the base URL for the API requests.
   - Adding a request interceptor to include the JWT token in the headers.
   - Adding a response interceptor to handle 401 errors and refresh the token if needed.
   - Automatically renewing the JWT token when a 401 error occurs and retrying the failed request.

For the actual code, refer to the file at:
`ClientApp/src/api/axiosConfig.ts`

### 7. **Create/Update `App.tsx`**

1. Create or update `App.tsx` to serve as the main entry point for rendering your `ScheduleListContainer` component and handling routing.
2. Ensure the `QueryClientProvider` is used to provide the API query client to the app.
3. Add i18n initialization to `App.tsx` to enable translations.
4. Import `loadCSS` and `ThemeProvider` from `@learnosity/lds`.
5. Call `loadCSS()` to load the LDS styles.
6. Wrap the application with `ThemeProvider` to provide LDS theming.

For the actual code, refer to the files at:

- `ClientApp/src/App.tsx`
- `ClientApp/src/App.scss`

### 8. **Add Multi-language Support with `i18n` for Schedule Data**

1. Configure `i18n` in `src/i18n.ts`.
2. Create translation files in the `public/locales` directory.
3. Fetch and display schedule data with translations in `pages/ScheduleListContainer.tsx`.
4. Translations are split into two different files and use two namespaces (`common` and `scheduleList`) for `useTranslation`.

For the actual code, refer to the files at:

- `ClientApp/src/i18n.ts`
- `ClientApp/public/locales/en/common.json`
- `ClientApp/public/locales/en/scheduleList.json`
- `ClientApp/src/App.tsx`
- `ClientApp/src/pages/ScheduleListContainer.tsx`

### 9. **ScheduleListContainer Component**

The `ScheduleListContainer` component is responsible for managing the state and actions related to the schedule list. It uses react-query for data fetching and mutations and manages local state for processing status and error handling.

Features:

- Fetches the list of schedules from the server.
- Handles the deletion of a schedule.
- Toggles the active status of a schedule.
- Creates a new schedule.
- Manages form state for creating a new schedule.
- Displays loading and error states.

The component uses the `ScheduleListPresenter` component to render the UI.

**Note:** All business logic and hooks should be in the `ScheduleListContainer` component. The `ScheduleListPresenter` component should be a "dumb" component that only handles presentation and styling.

For the actual code, refer to the file at:
`ClientApp/src/pages/ScheduleListContainer.tsx`

### 10. **ScheduleListPresenter Component**

The `ScheduleListPresenter` component is responsible for rendering the UI of the schedule list. It displays the list of schedules, handles user interactions for creating, deleting, and toggling the active status of schedules.

Features:

- Displays the list of schedules with details like exam name, date, and location.
- Provides input fields for creating a new schedule.
- Handles user actions for deleting and toggling the active status of schedules.
- Shows loading and error states.

The component receives props from the `ScheduleListContainer` component to manage state and actions.

For the actual code, refer to the file at:
`ClientApp/src/pages/ScheduleListPresenter.tsx`

### 11. **Integrate Learnosity Design System (LDS)**

To integrate the Learnosity Design System (LDS) component library, follow these steps:

1. **Create a GitHub Personal Access Token (Classic)**:

   - Follow the steps given in this private repository: [Learnosity Design System](https://github.com/Learnosity/lib-design-system).

2. **Add `.npmrc` File**:

   - Create a `.npmrc` file in the `ClientApp` directory with the following content:
     ```properties
     //npm.pkg.github.com/:_authToken=${NPM_TOKEN}
     @learnosity:registry=https://npm.pkg.github.com/
     ```

3. **Install LDS Package**:

   - Run the following command in the `ClientApp` directory to install the LDS package:
     ```sh
     npm install @learnosity/lds @learnosity/lds-design-tokens @learnosity/lds-qm-styles
     ```

4. **Update `App.tsx`**:

   - Import `loadCSS` and `ThemeProvider` from `@learnosity/lds`.
   - Call `loadCSS()` to load the LDS styles.
   - Wrap the application with `ThemeProvider` to provide LDS theming.

5. **Update `App.scss`**:

   - Use LDS design tokens to style your application.
   - Ensure the dark theme is applied correctly by overriding necessary styles.

6. **Use LDS Components**:
   - Replace existing form elements with LDS components such as `FormSelect` and `FormLabel`.
   - Ensure the components are styled according to the LDS guidelines.

For more details, refer to the [Learnosity Design System repository](https://github.com/Learnosity/lib-design-system).

### 12. **CSS Modules Configuration**

1. **Enable CSS Modules in Vite**:

   - Modify `vite.config.ts` to enable CSS Modules:
     ```typescript
     // vite.config.ts
     export default defineConfig({
       css: {
         modules: {
           localsConvention: "camelCase",
           generateScopedName: "qm_scheduling_[local]",
         },
       },
       // ...existing code...
     });
     ```

2. **Using CSS Modules in Components**:

   - Import the CSS Module in your component:

     ```tsx
     // ScheduleListPresenter.tsx
     import styles from "./ScheduleListPresenter.module.scss";

     const ScheduleListPresenter = () => {
       return (
         <div className={styles.scheduleTable}>{/* ...existing code... */}</div>
       );
     };
     ```

### 13. **Build and Run the Application**

1. In Visual Studio, build the solution:
   - Rebuild the entire solution to install dependencies and build the React app.
   - Run the API (`QM.Scheduling.Api`) from Visual Studio.
2. Navigate to the API endpoint in your browser to see the React app served from **wwwroot**.

### **Note for ClientApp Changes**

If you make changes only in the `ClientApp`, you don't need to stop and re-run the project from Visual Studio. Instead, you can directly run the following command in the `ClientApp` directory to build the React app and reflect the changes in the browser:

```sh
npm run build
```

This will rebuild the React app and the changes should be reflected in the browser without restarting the .NET API project (if it is already running).

## **Integrating Storybook**

### **Packages and Addons**

Install the following packages:

```sh
npm install @storybook/react-vite @storybook/addon-essentials @storybook/addon-a11y @storybook/addon-viewport
```

### **Configuration**

#### **main.ts**

Configure Storybook to include the necessary stories and addons.

Refer to:
`ClientApp/.storybook/main.ts`

#### **preview.ts**

Set up global decorators (LDS and i18n) and parameters.

Refer to:
`ClientApp/.storybook/preview.ts`

## **Additional Notes**

- Ensure that the `wwwroot` folder is added to your `.gitignore` file to avoid committing build artifacts to the repository. Add the following line to your `.gitignore` file:
  ```
  wwwroot/
  ```

## **Conclusion**

This setup integrates the **QM.Scheduling** React application into the .NET 8 API. It displays an online exam schedule list, supports JWT authentication, and includes multi-language support with translations. It also ensures secure multi-tenant access by validating the tenantId.
