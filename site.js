/* Builds every page from content.js. A page only gets the parts it has a
   container for, e.g. <div id="quests"> or <div id="scope" data-full>.
   data-full on a container means "show everything" (the See-all pages). */
(function () {
  "use strict";
  var C = window.CONTENT, H = document.documentElement;
  /* Where the project's images live, and where the site's pages live, relative to this page. */
  var ROOT = H.getAttribute("data-root") || "", SITE = H.getAttribute("data-site") || "";
  var asset = function (p) { return p ? ROOT + p : ""; };
  var page = function (p) { return SITE + p; };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var $ = function (id) { return document.getElementById(id); };
  var more = function (href, label) {
    return '<p class="more"><a href="' + esc(page(href)) + '">' + esc(label) + " →</a></p>";
  };

  /* ---------- dark mode, remembered from page to page ---------- */
  var ed = $("ed");
  var setEd = function (night) {
    if (night) H.setAttribute("data-ed", "night"); else H.removeAttribute("data-ed");
    if (ed) ed.textContent = night ? "☀ Light" : "☾ Dark";
  };
  setEd(H.getAttribute("data-ed") === "night");
  if (ed) ed.addEventListener("click", function () {
    var night = H.getAttribute("data-ed") !== "night";
    setEd(night);
    try { localStorage.setItem("ed", night ? "night" : "day"); } catch (e) {}
  });

  /* ---------- quest log ---------- */
  var links = function (ls) {
    if (!ls || !ls.length) return "";
    return '<div class="lnks">' + ls.map(function (l) {
      return '<a class="lnk" href="' + esc(l[1]) + '" target="_blank" rel="noopener">' + esc(l[0]) + " ↗</a>";
    }).join("") + "</div>";
  };
  var when = function (q) { return q.from ? "<b>" + esc(q.from) + "</b>" + esc(q.yr) : "<b>—</b>ongoing"; };
  var title = function (q) {
    return q.page
      ? '<a href="' + esc(page(q.page)) + '">' + esc(q.t) + '<span class="arr" aria-hidden="true">&nbsp;→</span></a>'
      : esc(q.t);
  };
  var quest = function (q) {
    return '<article class="entry' + (q.cur ? "" : " done") + '"><div class="when">' + when(q) + "</div><div>" +
      "<h3>" + title(q) + "</h3><p>" + esc(q.d) + "</p>" +
      (q.n ? '<p class="next"><b>Next</b>' + esc(q.n) + "</p>" : "") + links(q.l) + "</div></article>";
  };
  var qEl = $("quests-list");
  if (qEl) {
    var full = qEl.hasAttribute("data-full");
    var cur = C.quests.filter(function (q) { return q.cur; });
    var done = C.quests.filter(function (q) { return !q.cur; });
    var curShown = full ? cur : cur.slice(0, C.limits.currentOnHome);
    var doneShown = full ? done : done.slice(0, C.limits.completedOnHome);
    qEl.innerHTML = curShown.map(quest).join("") +
      (doneShown.length ? '<div class="divider mono">Completed</div>' + doneShown.map(quest).join("") : "");
    if (curShown.length + doneShown.length < C.quests.length)
      qEl.insertAdjacentHTML("afterend", more("quests.html", "Full quest log (" + C.quests.length + ")"));
  }

  /* ---------- pictures (microscope, art, the scroll) ---------- */
  var shots = [];
  var cap = function (o) { return esc(o.t) + (o.m ? ", <span>" + esc(o.m) + "</span>" : ""); };
  var shot = function (o) {
    shots.push(o);
    return '<button class="shot" type="button" data-i="' + (shots.length - 1) + '" aria-label="View ' + esc(o.t) + '">' +
      '<div class="frame"><img src="' + esc(asset(o.img)) + '" alt="' + esc(o.t) + '" loading="lazy"></div>' +
      (o.video ? '<span class="play">▶ clip</span>' : "") + "</button>";
  };
  var figure = function (o, style) {
    return "<figure" + (style ? ' style="' + style + '"' : "") + ">" + shot(o) + "<figcaption>" + cap(o) + "</figcaption></figure>";
  };
  /* label: the See-all link's words, e.g. "Full reading list"; otherwise "See all N <noun>". */
  var capped = function (el, list, limit, href, noun, label) {
    var full = el.hasAttribute("data-full");
    var shown = full ? list : list.slice(0, limit);
    if (!full && shown.length < list.length)
      el.insertAdjacentHTML("afterend", more(href, label ? label + " (" + list.length + ")" : "See all " + list.length + " " + noun));
    return shown;
  };

  var sEl = $("scope");
  if (sEl) sEl.innerHTML = capped(sEl, C.microscopy, C.limits.gallery, "microscopy.html", "specimens")
    .map(function (o) { return figure(o); }).join("");

  var aEl = $("artgrid");
  if (aEl) aEl.innerHTML = capped(aEl, C.art, C.limits.gallery, "art.html", "pieces")
    .map(function (o) { return figure(o, "--r:" + (o.r || 1)); }).join("");

  /* ---------- tools ---------- */
  var tEl = $("tools-list");
  if (tEl) tEl.innerHTML = capped(tEl, C.tools, C.limits.tools, "tools.html", "tools")
    .map(function (o) {
      return '<article class="tool">' + (o.img ? shot(o) : "<div></div>") + "<div>" +
        (o.building ? '<p class="wip mono">In progress</p>' : "") +
        "<h3>" + esc(o.t) + "</h3><p>" + esc(o.d) + "</p>" + links(o.l) + "</div></article>";
    }).join("");

  /* ---------- reading ---------- */
  /* Finished reads get a red check in the margin; everything else is blank. */
  var rEl = $("reading-list");
  if (rEl) {
    var rs = capped(rEl, C.reading, C.limits.reading, "reading.html", "readings", "Full reading list");
    rEl.innerHTML = rs.map(function (r) {
      return '<article class="read"><div class="check">' +
        (r.status === "read" ? '<span aria-hidden="true">✓</span><span class="sr">Finished:</span>' : "") + "</div><div>" +
        '<h3><a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.title) + ' <span class="ext">↗</span></a></h3>' +
        (r.source ? '<p class="src mono">' + esc(r.source) + "</p>" : "") +
        (r.note ? '<p class="note">' + esc(r.note) + "</p>" : "") + "</div></article>";
    }).join("") || '<p class="note">Nothing here yet.</p>';
  }

  /* ---------- things I'm into ---------- */
  var iEl = $("idx");
  if (iEl) iEl.innerHTML = C.into.map(function (e) {
    return '<a href="' + esc(page("index.html#" + e[1])) + '">' + esc(e[0]) + "</a>";
  }).join('&nbsp;<i aria-hidden="true">·</i> ');

  /* ---------- a quest's own page: header comes from the quest log ---------- */
  var qh = $("questhead");
  if (qh) {
    var q = C.quests.filter(function (x) { return x.slug === qh.getAttribute("data-slug"); })[0];
    if (q) {
      document.title = q.t + " · Tina He";
      $("qtitle").textContent = q.t;
      $("qwhen").textContent = (q.cur ? "Current" : "Completed") + " · " + (q.from ? q.from + " " + q.yr : "ongoing");
      qh.innerHTML = '<p class="lede">' + esc(q.d) + "</p>" +
        (q.n ? '<p class="next"><b>Next</b>' + esc(q.n) + "</p>" : "") + links(q.l);
    }
  }

  /* ---------- the scroll ---------- */
  var fEl = $("feed");
  if (fEl) {
    fEl.innerHTML = C.scroll.map(function (c) {
      var body = "";
      if (c.type === "image") body = shot(c) + "<figcaption>" + cap(c) + "</figcaption>";
      else if (c.type === "link") body = '<h3><a href="' + esc(c.url) + '" target="_blank" rel="noopener">' + esc(c.title) +
        ' <span class="ext">↗</span></a></h3>' + (c.source ? '<p class="src mono">' + esc(c.source) + "</p>" : "") +
        (c.note ? '<p class="note">' + esc(c.note) + "</p>" : "");
      else body = '<p class="big">' + esc(c.text) + "</p>" +
        (c.quest ? '<p class="from">for <a href="' + esc(page("index.html#quests")) + '">' + esc(c.quest) + "</a></p>" : "");
      return '<article class="card"><p class="ctag mono">' + esc(c.tag) + "</p>" + (c.type === "image" ? "<figure>" + body + "</figure>" : body) + "</article>";
    }).join("");
  }

  /* ---------- lightbox: any .shot opens big ---------- */
  var lb = $("lb");
  if (lb) {
    var im = $("lbimg"), vd = $("lbvid"), opener = null;
    var close = function () {
      lb.hidden = true; try { vd.pause(); } catch (e) {}
      vd.removeAttribute("src"); vd.load(); if (opener) opener.focus();
    };
    document.addEventListener("click", function (e) {
      var b = e.target.closest(".shot"); if (!b) return;
      opener = b;
      var o = b.hasAttribute("data-i") ? shots[+b.getAttribute("data-i")]
        : { img: null, src: b.querySelector("img").getAttribute("src"), capHTML: esc(b.getAttribute("data-cap") || "") };
      if (o.video) { im.hidden = true; vd.hidden = false; vd.poster = asset(o.img); vd.src = asset(o.video); }
      else {
        vd.hidden = true; im.hidden = false;
        im.src = o.src || asset(o.full || o.img); im.alt = b.getAttribute("aria-label") ? b.getAttribute("aria-label").replace("View ", "") : "";
      }
      $("lbcap").innerHTML = o.capHTML != null ? o.capHTML : cap(o);
      lb.hidden = false; $("lbx").focus();
    });
    $("lbx").addEventListener("click", close);
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !lb.hidden) close(); });
  }

  /* ---------- underline the section you're reading (home page only;
     other pages mark their own link with class="here" in the HTML) ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".contents a"));
  if ($("about") && navLinks.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) navLinks.forEach(function (a) {
          a.classList.toggle("here", a.getAttribute("data-sec") === en.target.id);
        });
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    document.querySelectorAll("section.part[id]").forEach(function (s) { io.observe(s); });
  }
})();
