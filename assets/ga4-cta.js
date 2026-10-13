(function () {
    "use strict";

    const allowedEvents = new Set([
        "cta_quickstart",
        "cta_repo",
        "cta_download_run_now",
        "cta_worked_model",
        "cta_feedback",
    ]);

    document.addEventListener("click", function (event) {
        const source = event.target;
        if (!(source instanceof Element)) return;

        const cta = source.closest("[data-ga-event]");
        if (!cta || typeof window.gtag !== "function") return;

        const eventName = cta.dataset.gaEvent;
        if (!allowedEvents.has(eventName)) return;

        const label = (cta.dataset.gaLabel || cta.textContent || "")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 100);
        const linkUrl = cta instanceof HTMLAnchorElement ? cta.href : "";

        window.gtag("event", eventName, {
            cta_location: cta.dataset.gaLocation || "unspecified",
            cta_label: label,
            link_url: linkUrl,
        });
    });
})();
