import { deepEqual } from "node:assert/strict";
import test from "node:test";

import { ga4TrackingFailures } from "./audit-site-rules.mjs";

test("GA4 audit accepts formatted guarded initialization", () => {
  const html = `
    <script>
      (function () {
        var productionHosts = new Set([
          "volantlabs.ai",
          "www.volantlabs.ai",
        ]);
        if (!productionHosts.has(window.location.hostname)) return;

        var script = document.createElement("script");
        script.async = true;
        script.src =
          "https://www.googletagmanager.com/gtag/js?id=G-VNXWVPERBQ";
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag() {
          window.dataLayer.push(arguments);
        };
        window.gtag("js", new Date());
        window.gtag("config", "G-VNXWVPERBQ");
      })();
    </script>
  `;

  deepEqual(ga4TrackingFailures("index.html", html), []);
});

test("GA4 audit rejects unguarded async loader", () => {
  const html = `
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-VNXWVPERBQ"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", "G-VNXWVPERBQ");
    </script>
  `;

  deepEqual(ga4TrackingFailures("index.html", html), [
    "index.html loads GA4 before checking the production host",
    "index.html is missing the GA4 production-host guard",
  ]);
});
