import { deepEqual } from "node:assert/strict";
import test from "node:test";

import {
  externalContactLinkFailures,
  forbiddenPatternFailures,
  ga4TrackingFailures,
  jsonLdFailures,
  seoBaselineFailures,
} from "./audit-site-rules.mjs";

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

test("external Contact audit accepts safe new-tab links", () => {
  const html = `
    <a
      href="https://www.volantpartners.com/contact"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact Volant Partners — opens volantpartners.com"
    >Contact</a>
  `;

  deepEqual(externalContactLinkFailures("index.html", html), []);
});

test("external Contact audit rejects same-tab links", () => {
  const html = `
    <a
      href="https://www.volantpartners.com/contact"
      aria-label="Contact Volant Partners — opens volantpartners.com"
    >Contact</a>
  `;

  deepEqual(externalContactLinkFailures("index.html", html), [
    "index.html Contact link should open in a new tab with noopener and noreferrer",
  ]);
});

test("forbidden copy audit scans LLM Markdown", () => {
  deepEqual(
    forbiddenPatternFailures(
      [
        {
          name: "llms/pages/engine.md",
          content: "Install from the sysml-foundation branch.",
        },
      ],
      [/sysml-foundation/i],
    ),
    [
      "Forbidden pattern /sysml-foundation/i found in llms/pages/engine.md",
    ],
  );
});

test("forbidden copy audit catches the retired platform brand in exported staging files", () => {
  const retiredName = "Kes" + "her";
  const retiredPattern = new RegExp(`\\b${retiredName}\\b`, "i");

  deepEqual(
    forbiddenPatternFailures(
      [
        {
          name: "design/sitemap.md",
          content: `Route builders from Vellis to ${retiredName}.`,
        },
        {
          name: "README.md",
          content: "Describe the source repository generically.",
        },
      ],
      [retiredPattern],
    ),
    [
      `Forbidden pattern ${retiredPattern} found in design/sitemap.md`,
    ],
  );
});

test("SEO baseline accepts a page with title, description, and matching canonical", () => {
  const html = `
    <title>
      Vellis — open-source context graph engine · volantlabs.ai
    </title>
    <meta name="description" content="An open-source context graph engine for AI agents." />
    <link rel="canonical" href="https://volantlabs.ai/engine.html" />
  `;

  deepEqual(
    seoBaselineFailures("engine.html", html, "https://volantlabs.ai/engine.html"),
    [],
  );
});

test("SEO baseline rejects missing title, empty description, and wrong canonical", () => {
  const html = `
    <title>  </title>
    <meta name="description" content="  " />
    <link rel="canonical" href="https://example.com/engine.html" />
  `;

  deepEqual(
    seoBaselineFailures("engine.html", html, "https://volantlabs.ai/engine.html"),
    [
      "engine.html is missing a non-empty <title>",
      "engine.html is missing a non-empty meta description",
      'engine.html canonical expected "https://volantlabs.ai/engine.html" but found "https://example.com/engine.html"',
    ],
  );
});

test("SEO baseline reports a missing canonical link", () => {
  const html = `
    <title>Vellis</title>
    <meta name="description" content="Context graph engine." />
  `;

  deepEqual(seoBaselineFailures("index.html", html, "https://volantlabs.ai/"), [
    "index.html is missing a canonical link",
  ]);
});

test("JSON-LD audit accepts valid blocks and flags invalid JSON", () => {
  const valid = `
    <script type="application/ld+json">
      { "@context": "https://schema.org", "@type": "Article" }
    </script>
  `;
  const invalid = `
    <script type="application/ld+json">
      { "@context": "https://schema.org", }
    </script>
  `;

  deepEqual(jsonLdFailures("page.html", valid), []);
  deepEqual(jsonLdFailures("page.html", invalid), [
    "page.html JSON-LD block 1 does not parse as valid JSON",
  ]);
});

test("JSON-LD audit requires a block when the page demands one", () => {
  deepEqual(jsonLdFailures("engine.html", "<p>No structured data.</p>", { required: true }), [
    "engine.html is missing a required JSON-LD block",
  ]);
  deepEqual(jsonLdFailures("thesis.html", "<p>No structured data.</p>"), []);
});
