// This script is responsible for loading the Vite manifest and dynamically injecting the main JavaScript and CSS files into the HTML document.
// Additionally, we can make an API call here to get the initial JWT token and store in session storage if needed.

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
