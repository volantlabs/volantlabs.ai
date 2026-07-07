export const ga4MeasurementId = "G-VNXWVPERBQ";

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
