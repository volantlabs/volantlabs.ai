export const ga4MeasurementId = "G-VNXWVPERBQ";
export const volantPartnersContactUrl =
  "https://www.volantpartners.com/contact";

const ga4ScriptUrl = `https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`;

export function ga4TrackingFailures(page, html) {
  const failures = [];
  if (hasUnguardedAsyncGa4Loader(html)) {
    failures.push(`${page} loads GA4 before checking the production host`);
  }
  if (!html.includes(ga4ScriptUrl)) {
    failures.push(
      `${page} is missing the GA4 gtag.js loader for ${ga4MeasurementId}`,
    );
  }
  if (!hasProductionHostGuard(html)) {
    failures.push(`${page} is missing the GA4 production-host guard`);
  }
  if (!/window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\]/.test(html)) {
    failures.push(`${page} is missing the GA4 dataLayer initialization`);
  }
  if (
    !/window\.gtag\s*=\s*function gtag\(\)\s*\{\s*window\.dataLayer\.push\(arguments\);\s*\}/.test(
      html,
    )
  ) {
    failures.push(`${page} is missing the GA4 gtag helper`);
  }
  if (!/window\.gtag\s*\(\s*["']js["']\s*,\s*new Date\(\)\s*\);/.test(html)) {
    failures.push(`${page} is missing the GA4 js initialization event`);
  }
  if (
    !new RegExp(
      `window\\.gtag\\s*\\(\\s*["']config["']\\s*,\\s*["']${escapeRegExp(ga4MeasurementId)}["']\\s*\\);`,
    ).test(html)
  ) {
    failures.push(`${page} is missing the GA4 config call for ${ga4MeasurementId}`);
  }
  return failures;
}

export function externalContactLinkFailures(page, html) {
  const failures = [];
  const contactLinks = extractAnchors(html).filter(
    (anchor) => anchor.attributes.href === volantPartnersContactUrl,
  );

  for (const contact of contactLinks) {
    const label = contact.attributes["aria-label"] ?? "";
    if (
      !/\bVolant Partners\b/.test(label) ||
      !/\bvolantpartners\.com\b/.test(label)
    ) {
      failures.push(
        `${page} Contact link should identify Volant Partners and the volantpartners.com domain`,
      );
    }

    const relTokens = (contact.attributes.rel ?? "").split(/\s+/);
    if (
      contact.attributes.target !== "_blank" ||
      !relTokens.includes("noopener") ||
      !relTokens.includes("noreferrer")
    ) {
      failures.push(
        `${page} Contact link should open in a new tab with noopener and noreferrer`,
      );
    }
  }

  return failures;
}

export function forbiddenPatternFailures(files, patterns) {
  const failures = [];

  for (const pattern of patterns) {
    const offenders = files
      .filter(({ content }) => pattern.test(content))
      .map(({ name }) => name);
    if (offenders.length) {
      failures.push(
        `Forbidden pattern ${pattern} found in ${offenders.join(", ")}`,
      );
    }
  }

  return failures;
}

function hasUnguardedAsyncGa4Loader(html) {
  return new RegExp(
    `<script\\b(?=[^>]*\\basync\\b)(?=[^>]*\\bsrc\\s*=\\s*["']${escapeRegExp(ga4ScriptUrl)}["'])[^>]*>`,
  ).test(html);
}

function hasProductionHostGuard(html) {
  return (
    /new\s+Set\s*\(\s*\[[\s\S]*?["']volantlabs\.ai["'][\s\S]*?["']www\.volantlabs\.ai["'][\s\S]*?\]\s*\)/.test(
      html,
    ) &&
    /productionHosts\s*\.\s*has\s*\(\s*window\s*\.\s*location\s*\.\s*hostname\s*\)/.test(
      html,
    )
  );
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractAnchors(html) {
  const anchors = [];
  const anchorPattern = /<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi;
  let match;
  while ((match = anchorPattern.exec(html))) {
    anchors.push({ attributes: parseAttributes(match[1]) });
  }
  return anchors;
}

function parseAttributes(rawAttributes) {
  const attributes = {};
  const attributePattern = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  let match;
  while ((match = attributePattern.exec(rawAttributes))) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? "";
  }
  return attributes;
}
