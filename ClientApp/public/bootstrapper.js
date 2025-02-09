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
