import { deepEqual } from "node:assert/strict";
import test from "node:test";

import {
  ga4CtaAssetFailures,
  ga4CtaCoverageFailures,
  ga4CtaPageFailures,
  externalContactLinkFailures,
  forbiddenPatternFailures,
  ga4TrackingFailures,
  jsonLdFailures,
  seoBaselineFailures,
  thirdPartyAutoLoadFailures,
} from "./audit-site-rules.mjs";

test("named CTA audit requires all five conversion paths", () => {
  const files = [
    {
      name: "index.html",
      content: `
        <a data-ga-event="cta_quickstart">Quickstart</a>
        <a data-ga-event="cta_repo">Repository</a>
        <button data-ga-event="cta_download_run_now">Run now</button>
        <button data-ga-event="cta_worked_model">Worked model</button>
        <a data-ga-event="cta_feedback">Feedback</a>
      `,
    },
  ];

  deepEqual(ga4CtaCoverageFailures(files), []);
  deepEqual(ga4CtaCoverageFailures([{ name: "index.html", content: "" }]), [
    "Named CTA coverage is missing cta_quickstart",
    "Named CTA coverage is missing cta_repo",
    "Named CTA coverage is missing cta_download_run_now",
    "Named CTA coverage is missing cta_worked_model",
    "Named CTA coverage is missing cta_feedback",
  ]);
});

test("named CTA page audit requires the shared helper on tracked pages", () => {
  deepEqual(
    ga4CtaPageFailures(
      "index.html",
      '<a data-ga-event="cta_quickstart"></a><script defer src="assets/ga4-cta.js"></script>',
    ),
    [],
  );
  deepEqual(
    ga4CtaPageFailures(
      "perspectives/example.html",
      '<a data-ga-event="cta_quickstart"></a><script defer src="../assets/ga4-cta.js"></script>',
    ),
    [],
  );
  deepEqual(ga4CtaPageFailures("index.html", "<a data-ga-event='cta_repo'></a>"), [
    "index.html is missing the shared GA4 CTA helper at assets/ga4-cta.js",
  ]);
  deepEqual(ga4CtaPageFailures("perspectives.html", "<p>No named CTA.</p>"), []);
});

test("named CTA helper audit requires delegated guarded gtag dispatch", () => {
  const source = `
    const allowedEvents = new Set([
      "cta_quickstart",
      "cta_repo",
      "cta_download_run_now",
      "cta_worked_model",
      "cta_feedback",
    ]);
    document.addEventListener("click", (event) => {
      const cta = event.target.closest("[data-ga-event]");
      if (!cta || typeof window.gtag !== "function") return;
      if (!allowedEvents.has(cta.dataset.gaEvent)) return;
      window.gtag("event", cta.dataset.gaEvent, { cta_location: "test" });
    });
  `;

  deepEqual(ga4CtaAssetFailures(source), []);
  deepEqual(ga4CtaAssetFailures(""), [
    "GA4 CTA helper is missing cta_quickstart",
    "GA4 CTA helper is missing cta_repo",
    "GA4 CTA helper is missing cta_download_run_now",
    "GA4 CTA helper is missing cta_worked_model",
    "GA4 CTA helper is missing cta_feedback",
    "GA4 CTA helper is missing delegated data-ga-event click handling",
    "GA4 CTA helper is missing a guarded gtag event dispatch",
  ]);
});

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

test("GA4 audit accepts an explicit no-third-party page with no automatic external loads", () => {
  const html = `
    <meta name="volant-network-policy" content="no-third-party" />
    <link rel="canonical" href="https://volantlabs.ai/scenario-lab/" />
    <a href="https://github.com/volantlabs/vellis">Open repository</a>
    <script src="scenario-lab.js"></script>
  `;

  deepEqual(ga4TrackingFailures("scenario-lab/index.html", html), []);
});

test("GA4 audit rejects automatic third-party loads on an exempt page", () => {
  const html = `
    <meta name="volant-network-policy" content="no-third-party" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat" />
  `;

  deepEqual(ga4TrackingFailures("scenario-lab/index.html", html), [
    "scenario-lab/index.html declares no-third-party network policy but auto-loads https://fonts.googleapis.com/css2?family=Montserrat",
  ]);
});

test("no-third-party audit rejects external absolute and protocol-relative automatic loads", () => {
  for (const prefix of ["https://", "http://", "//"]) {
    const url = `${prefix}example.com/demo.js`;
    for (const html of [
      `<script src="${url}"></script>`,
      `<link rel="stylesheet" href="${url}" />`,
      `<img src="${url}" />`,
      `<script>fetch("${url}");</script>`,
      `<script>new WebSocket("${url}");</script>`,
      `<script>new EventSource("${url}");</script>`,
      `<script>script.src = "${url}";</script>`,
    ]) {
      deepEqual(thirdPartyAutoLoadFailures("fixture.html", html), [
        `fixture.html declares no-third-party network policy but auto-loads ${url}`,
      ], html);
    }
  }
});

test("no-third-party audit preserves allowed hosts and relative assets", () => {
  const urls = [
    "https://volantlabs.ai/demo.js",
    "https://www.volantlabs.ai/demo.js",
    "//volantlabs.ai/demo.js",
    "//www.volantlabs.ai/demo.js",
    "//WWW.VOLANTLABS.AI/demo.js",
    "demo.js",
    "./demo.js",
    "../assets/demo.js",
    "/assets/demo.js",
  ];
  for (const url of urls) {
    const html = `<script src="${url}"></script>
      <link rel="stylesheet" href="${url}" />
      <script>fetch("${url}"); script.src = "${url}";</script>`;
    deepEqual(thirdPartyAutoLoadFailures("fixture.html", html), [], url);
  }
});

test("no-third-party audit matches complete hostnames for protocol-relative URLs", () => {
  const url = "//volantlabs.ai.example.com/demo.js";
  deepEqual(thirdPartyAutoLoadFailures("fixture.html", `<script src="${url}"></script>`), [
    `fixture.html declares no-third-party network policy but auto-loads ${url}`,
  ]);
});

test("GA4 audit applies the protocol-relative rule to an exempt page", () => {
  const html = `<meta name="volant-network-policy" content="no-third-party" />
    <script src="//example.com/demo.js"></script>`;
  deepEqual(ga4TrackingFailures("scenario-lab/index.html", html), [
    "scenario-lab/index.html declares no-third-party network policy but auto-loads //example.com/demo.js",
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
