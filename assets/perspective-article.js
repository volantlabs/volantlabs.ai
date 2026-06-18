(function () {
  const posts = window.PERSPECTIVE_POSTS || [];
  const root = document.getElementById("article-root");
  const slug = document.body.dataset.perspectiveSlug;
  const post = posts.find((item) => item.slug === slug);

  function text(value) {
    return document.createTextNode(value || "");
  }

  function node(tag, attrs, children) {
    const element = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (value === null || value === undefined || value === false) return;
      if (key === "className") element.className = value;
      else if (key === "text") element.textContent = value;
      else element.setAttribute(key, value);
    });
    (children || []).forEach((child) => {
      element.appendChild(typeof child === "string" ? text(child) : child);
    });
    return element;
  }

  function postBySlug(relatedSlug) {
    return posts.find((item) => item.slug === relatedSlug);
  }

  function renderMissing() {
    root.replaceChildren(
      node("section", { className: "article-missing wrap" }, [
        node("p", { className: "article-kicker", text: "Perspective unavailable" }),
        node("h1", { text: "This perspective is not in the manifest." }),
        node("p", { text: "Return to the library to choose another piece." }),
        node("a", { className: "btn btn-primary", href: "../perspectives.html", text: "Back to Perspectives" })
      ])
    );
  }

  function renderHero() {
    const meta = node("div", { className: "article-meta" }, [
      node("span", { text: post.displayDate }),
      node("span", { text: post.readingTime }),
      node("span", { text: post.provenanceLine })
    ]);

    return node("section", { className: "article-hero" }, [
      node("div", { className: "wrap article-hero-grid" }, [
        node("div", {}, [
          node("a", { className: "backlink", href: "../perspectives.html", text: "Back to Perspectives" }),
          node("span", { className: `lanepill ${post.kind}`, text: post.kindLabel }),
          node("h1", { text: post.title }),
          node("p", { className: "dek", text: post.dek }),
          meta
        ]),
        node("aside", { className: "article-summary", "aria-label": "Perspective summary" }, [
          node("strong", { text: post.statusLabel }),
          node("p", { text: "Every Perspectives piece keeps authorship and ratification visible. The full provenance footer lives with the article." }),
          node("div", { className: "tag-row" }, post.tags.map((tag) => node("span", { text: tag })))
        ])
      ])
    ]);
  }

  function renderBody() {
    const article = node("article", { className: "article-body" });
    post.body.forEach((section) => {
      article.appendChild(node("h2", { text: section.heading }));
      section.paragraphs.forEach((paragraph) => {
        article.appendChild(node("p", { text: paragraph }));
      });
    });
    return article;
  }

  function renderProvenance() {
    const rows = [
      ["Provenance", post.provenance.source],
      ["Reasoning layer", post.provenance.reasoningLayer],
      ["Human ratifier", post.provenance.humanRatifier],
      ["Status", post.provenance.status],
      ["Known uncertainty", post.provenance.knownUncertainty],
      ["Dissent", post.provenance.dissent],
      ["Next falsifier", post.provenance.nextFalsifier]
    ];
    return node("section", { className: "provenance-panel", "aria-labelledby": "provenance-title" }, [
      node("div", { className: "provenance-head" }, [
        node("p", { className: "article-kicker", text: "Provenance" }),
        node("h2", { id: "provenance-title", text: "How this piece should be read" })
      ]),
      node("dl", {}, rows.flatMap(([term, definition]) => [
        node("dt", { text: term }),
        node("dd", { text: definition })
      ]))
    ]);
  }

  function renderRelated() {
    const cards = post.related.map(postBySlug).filter(Boolean).map((item) => (
      node("a", { className: "related-card", href: `../${item.url}` }, [
        node("span", { className: `lanepill ${item.kind}`, text: item.kindLabel }),
        node("h3", { text: item.shortTitle }),
        node("p", { text: item.dek }),
        node("span", { className: "read", text: "Read next ->" })
      ])
    ));
    return node("section", { className: "related-block" }, [
      node("div", { className: "related-head" }, [
        node("p", { className: "article-kicker", text: "Keep reading" }),
        node("h2", { text: "Related perspectives" })
      ]),
      node("div", { className: "related-grid" }, cards)
    ]);
  }

  function renderArticle() {
    document.title = `${post.title} - Perspectives - volantlabs.ai`;
    const description = document.querySelector("meta[name='description']");
    if (description) description.setAttribute("content", post.dek);
    root.replaceChildren(
      renderHero(),
      node("section", { className: "article-main wrap" }, [
        renderBody(),
        renderProvenance(),
        renderRelated()
      ]),
      node("section", { className: "band article-subscribe" }, [
        node("div", { className: "wrap subscribe-panel" }, [
          node("h2", { text: "Stay close to the thinking" }),
          node("p", { text: "New essays, graph dispatches, and ratified notes as they land." }),
          node("div", { className: "article-actions" }, [
            node("a", { className: "btn btn-primary", href: "mailto:hello@volantpartners.com?subject=Subscribe%20to%20volantlabs.ai%20Perspectives", text: "Request updates" }),
            node("a", { className: "btn btn-ghost", href: "../feed.xml", text: "RSS feed" })
          ])
        ])
      ])
    );
  }

  if (!root) return;
  if (!post) renderMissing();
  else renderArticle();
})();
