# **QM.Scheduling - Scheduling Application**

This explains how we have set up **QM.Scheduling**, a **React** application using **Vite**, **TypeScript**, **SCSS**, and **translations** to display an **online exam schedule list**.
The React app is integrated with a **.NET 8 API** and is served from **wwwroot** inside the API project.

---

## **Project Overview**

- **React App** built with **Vite**, **TypeScript**, and **SCSS**.
- **.NET 8 API** provides the exam schedule data.
- The React app is built and served from **wwwroot** inside the API project.
- **JWT authentication** is used for API requests.
- **i18n translations** for multi-language support.

---

## **Solution Structure**

- `QM.Scheduling.Api` — .NET 8 API project
- `ClientApp` — React project built with Vite

---

## **Prerequisites**

- **Node.js** and **npm**: Install from [nodejs.org](https://nodejs.org/)
- **.NET SDK**: Install from [dotnet.microsoft.com](https://dotnet.microsoft.com/download)
- **Visual Studio**: Install from [visualstudio.microsoft.com](https://visualstudio.microsoft.com/)

---

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
3. \*\*Install the necessary packages in the `ClientApp`:
   ```sh
   npm install sass
   npm install axios axios-retry
   npm install react-i18next i18next i18next-http-backend i18next-browser-languagedetector
   ```

---

### 2. **Configure the `csproj` File**

Add the following configuration in your `QM.Scheduling.Api.csproj` to build the React app during the .NET build or publish process:

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>disable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>

    <!-- Path to the React project -->
    <ClientAppPath>$(ProjectDir)..\ClientApp</ClientAppPath>
  </PropertyGroup>

  <!-- Build React app before .NET build/publish -->
  <Target Name="BuildClient" BeforeTargets="Build;Publish">
    <Exec WorkingDirectory="$(ClientAppPath)" Command="npm install" />
    <Exec WorkingDirectory="$(ClientAppPath)" Command="npm run build" />
  </Target>

</Project>
```

---

### 3. **Update `Program.cs`**

Modify your `Program.cs` to serve the React app from the `wwwroot` folder and handle fallback for client-side routing:

```csharp
public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddControllers();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        app.UseStaticFiles(); // Serve static files from wwwroot

        app.UseHttpsRedirection();
        app.UseAuthorization();
        app.MapControllers();

        if (app.Environment.IsDevelopment())
            app.MapFallbackToFile("index.html"); // Serve React app during development

        app.Run();
    }
}
```

---

### 4. **Add the `/scheduleList` Endpoint in Your .NET API**

1. **Create a Schedule model** in your .NET project:
   Add a new file `Models/Schedule.cs`:

   ```csharp
       public class Schedule
       {
           public int Id { get; set; }
           public string ExamName { get; set; }
           public DateTime Date { get; set; }
           public string Location { get; set; }
       }
   ```

2. **Add a ScheduleController** to handle the `/scheduleList` endpoint:
   In the `Controllers` folder, add a new `ScheduleController.cs` file:

   ```csharp

   [ApiController]
   [Route("[controller]")]
   public class ScheduleController : ControllerBase
   {
       [HttpGet("scheduleList")]
       public ActionResult<IEnumerable<Schedule>> GetScheduleList()
       {
           var schedules = new List<Schedule>
           {
               new Schedule { Id = 1, ExamName = "Math Exam", Date = DateTime.Now.AddDays(1), Location = "Room 101" },
               new Schedule { Id = 2, ExamName = "Science Exam", Date = DateTime.Now.AddDays(2), Location = "Room 202" },
               new Schedule { Id = 3, ExamName = "History Exam", Date = DateTime.Now.AddDays(3), Location = "Room 303" }
           };

           return Ok(schedules);
       }
   }
   ```

---

## Frontend (React) Configuration

### 1. **Configure the React App for .NET Integration**

1. In `ClientApp`, modify `vite.config.ts`:

   ```ts
   import { defineConfig } from "vite";
   import react from "@vitejs/plugin-react";

   export default defineConfig({
     plugins: [react()],
     build: {
       outDir: "../QM.Scheduling.Api/wwwroot", // Output to .NET wwwroot
       emptyOutDir: true, // Clear wwwroot before each build
       manifest: true, // Generate manifest.json for bootstrapper.js
       rollupOptions: {
         input: {
           main: "src/main.tsx", // React entry point
         },
       },
     },
   });
   ```

---

### 2. **Customize the HTML Template**

1. Remove the default index.html and all css files and create `public/index.html` with your custom HTML:
   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>Scheduling</title>
     </head>
     <body>
       <p>Portal</p>
       <div id="scheduling-root"></div>
       <script>
         sessionStorage.setItem(
           "qmSchedulingJwtToken",
           "my-initial-jwt-token-here"
         );
         sessionStorage.setItem(
           "qmSchedulingBaseUrl",
           "https://localhost:5001"
         );
       </script>
       <script src="./bootstrapper.js?v=1"></script>
     </body>
   </html>
   ```

---

### 3. **Create `bootstrapper.js`**

1. Create `public/bootstrapper.js` to dynamically load the React app using the Vite manifest:

   ```js
   fetch("/.vite/manifest.json")
     .then((response) => response.json())
     .then((manifest) => {
       const mainJs = manifest["src/main.tsx"].file;
       const mainCss = manifest["src/main.tsx"].css
         ? manifest["src/main.tsx"].css[0]
         : null;

       if (mainCss) {
         const link = document.createElement("link");
         link.rel = "stylesheet";
         link.href = `/${mainCss}`;
         document.head.appendChild(link);
       }

       const script = document.createElement("script");
       script.type = "module";
       script.src = `/${mainJs}`;
       document.body.appendChild(script);
     })
     .catch((error) => console.error("Error loading manifest:", error));
   ```

---

### 4. **Modify `main.tsx`**

1. Update `src/main.tsx` to render the React app inside the `scheduling-root` element and also load i18n:

   ```tsx
   import "./i18n";
   import React from "react";
   import ReactDOM from "react-dom/client";
   import App from "./App";

   const rootElement = document.getElementById("scheduling-root");

   if (rootElement) {
     ReactDOM.createRoot(rootElement).render(
       <React.StrictMode>
         <App />
       </React.StrictMode>
     );
   } else {
     console.error("scheduling-root element not found!");
   }
   ```

---

### 5: **Create/Update `App.tsx`**

The `App.tsx` will serve as the main entry point for rendering your `ScheduleList` component and handling routing (if necessary). Here’s how to create or update it.

```tsx
import "./App.scss";
import React from "react";
import { useTranslation } from "react-i18next";

import ScheduleList from "./pages/ScheduleList";

const App: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="App">
      <header className="App-header">
        <h1>{t("title")}</h1>
      </header>
      <main>
        <ScheduleList />
      </main>
    </div>
  );
};

export default App;
```

App.scss:

```scss
.App {
  text-align: center;
  font-family: "Arial", sans-serif;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  font-size: 1.5rem;
}

main {
  padding: 20px;
}
```

---

### 6. **Add Multi-language Support with `i18n` for Schedule Data**

1. **Configure `i18n` in `src/i18n.ts`**:

   ```ts
   import i18n from "i18next";
   import { initReactI18next } from "react-i18next";
   import HttpBackend from "i18next-http-backend";
   import LanguageDetector from "i18next-browser-languagedetector";

   i18n
     .use(HttpBackend)
     .use(LanguageDetector)
     .use(initReactI18next)
     .init({
       fallbackLng: "en",
       debug: false,
       ns: ["common", "scheduleList"],
       defaultNS: "common",
       interpolation: {
         escapeValue: false, // React already escapes values
       },
       backend: {
         loadPath: "/locales/{{lng}}/{{ns}}.json", // Path to translation files
       },
     });

   export default i18n;
   ```

2. **Create translation files** in the `public/locales` directory:

   Example directory structure:

   ```
   public/
     locales/
       en/
         common.json
         scheduleList.json
       fr/
         common.json
         scheduleList.json
   ```

   Example translations (English):

   ```json
   {
     "title": "Online Exam Schedule",
     "selectLanguage": "Select Language"
   }
   ```

   ```json
   {
     "loading": "Loading schedule...",
     "error": "Failed to fetch schedule data.",
     "noData": "No schedule available."
   }
   ```

3. **Fetch and Display Schedule Data with Translations** in `pages/ScheduleList.tsx`:

In your `src/models` folder, create a file called `Schedule.ts` and define the `Schedule` interface:

```ts
export interface Schedule {
  id: number;
  examName: string;
  date: string;
  location: string;
}
```

Then create a new file `src/pages/ScheduleList.tsx` to fetch and display the schedule data:

```tsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getScheduleList } from "../SchedulingApi";
import { Schedule } from "./models/Schedule";

const ScheduleList: React.FC = () => {
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
        setError(t("error"));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [t]);

  if (loading) return <p>{t("loading")}</p>;
  if (error) return <p>{error}</p>;
  if (schedules.length === 0) return <p>{t("noData")}</p>;

  return (
    <div>
      <h1>{t("title")}</h1>
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

export default ScheduleList;
```

### 7. **Axios Configuration for Schedule Service**

1. Create a new file `src/axiosConfig.ts` to configure Axios:

   ```ts
   import axios from "axios";
   import axiosRetry from "axios-retry";

   const baseURL =
     sessionStorage.getItem("qmSchedulingBaseUrl") ||
     "https://default-api-url.com";

   const apiClient = axios.create({
     baseURL,
     headers: {
       "Content-Type": "application/json",
     },
   });

   // Apply retry logic
   axiosRetry(apiClient, {
     retries: 3,
     retryCondition: (error) => {
       const status = error.response?.status ?? 0;
       // Retry only if the status is not in the list of non-retry-able statuses
       return ![400, 403, 404, 409].includes(status);
     },
     retryDelay: (retryCount) => retryCount * 10000, // Spread 3 retries over 60 seconds
   });

   // Add a request interceptor to include the JWT token
   apiClient.interceptors.request.use((config) => {
     const token = sessionStorage.getItem("qmSchedulingJwtToken");
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });

   // Add a response interceptor for error handling
   apiClient.interceptors.response.use(
     (response) => response,
     (error) => {
       if (error.response && error.response.status === 401) {
         // Handle unauthorized access (e.g., renew token in session storage)
         console.error("Unauthorized! Renew the token.");
       }
       return Promise.reject(error);
     }
   );

   export default apiClient;
   ```

2. Add `SchedulingApi.ts` to use the configured Axios instance:

   ```ts
   import apiClient from "./axiosConfig";

   export const getScheduleList = async () => {
     try {
       const response = await apiClient.get("/scheduleList");
       return response.data;
     } catch (error) {
       console.error("Failed to fetch schedule data:", error);
       throw error;
     }
   };
   ```

---

### **8. Build and Run the Application**

1. In Visual Studio, build the solution:

   - **Rebuild** the entire solution to install dependencies and build the React app.
   - Run the API (`QM.Scheduling.Api`) from Visual Studio.

2. Navigate to the API endpoint in your browser to see the React app served from **wwwroot**.

---

## **Security Configuration**

### **JWT Authentication**

- **Token Validation**: Ensure that the JWT tokens are validated properly, including checking the signature, issuer, audience, and expiration.
- **Secure Storage**: Store the JWT token securely in the client (e.g., sessionStorage) and include it in the Authorization header for API requests.

### **HTTPS**

- **Enforce HTTPS**: Ensure that all API requests are made over HTTPS to protect data in transit.
- **Redirect HTTP to HTTPS**: Configure the server to redirect HTTP requests to HTTPS.

### **CORS**

- **Cross-Origin Resource Sharing (CORS)**: Configure CORS to allow only trusted origins to access the API.

### **Authorization Policies**

- **Fine-Grained Access Control**: Define and enforce authorization policies to control access to different parts of the API based on user roles and permissions.

### **Error Handling**

- **Graceful Error Handling**: Implement proper error handling to return meaningful error messages without exposing sensitive information.

---

## **Conclusion**

This setup integrates the **QM.Scheduling** React application into the .NET 8 API. It displays an online exam schedule list, supports JWT authentication, and includes multi-language support with translations.

---

## **Enjoy building your Scheduling Application!** 🗓️✨

---

Let me know if you want to tweak or expand on any part of this!
