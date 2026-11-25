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
  /* A YouTube link's video id, or null. */
  var ytId = function (u) {
    var m = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/.exec(u || "");
    return m ? m[1] : null;
  };
  /* YouTube links play right here in the viewer (marked ▶), so visitors
     never land on YouTube's page with its likes and comments.
     cap: the caption to show under the video. */
  var links = function (ls, cap) {
    if (!ls || !ls.length) return "";
    return '<div class="lnks">' + ls.map(function (l) {
      var id = ytId(l[1]);
      return id
        ? '<a class="lnk" href="' + esc(l[1]) + '" data-yt="' + id + '" data-cap="' + esc(cap || "") + '">' + esc(l[0]) + " ▶</a>"
        : '<a class="lnk" href="' + esc(l[1]) + '" target="_blank" rel="noopener">' + esc(l[0]) + " ↗</a>";
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
      "<h3>" + title(q) + "</h3>" + (q.d ? "<p>" + esc(q.d) + "</p>" : "") +
      (q.n ? '<p class="next"><b>Next</b>' + esc(q.n) + "</p>" : "") + links(q.l, q.t) + "</div></article>";
  };
  /* Completed quests on the home page: date and title, with any links on the
     line below (same as current quests). The full quest log keeps descriptions too. */
  var brief = function (q) {
    return '<article class="entry done brief"><div class="when">' + when(q) + "</div><div><h3>" +
      title(q) + "</h3>" + links(q.l, q.t) + "</div></article>";
  };
  var qEl = $("quests-list");
  if (qEl) {
    var full = qEl.hasAttribute("data-full");
    var cur = C.quests.filter(function (q) { return q.cur; });
    var done = C.quests.filter(function (q) { return !q.cur; });
    var curShown = full ? cur : cur.slice(0, C.limits.currentOnHome);
    var doneShown = full ? done : done.slice(0, C.limits.completedOnHome);
    qEl.innerHTML = curShown.map(quest).join("") +
      (doneShown.length ? '<div class="divider mono">Completed</div>' + doneShown.map(full ? quest : brief).join("") : "");
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
        (q.n ? '<p class="next"><b>Next</b>' + esc(q.n) + "</p>" : "") + links(q.l, q.t);
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
    var im = $("lbimg"), vd = $("lbvid"), yt = null, opener = null;
    var close = function () {
      lb.hidden = true; try { vd.pause(); } catch (e) {}
      vd.removeAttribute("src"); vd.load();
      if (yt) { yt.removeAttribute("src"); yt.hidden = true; }
      if (opener) opener.focus();
    };
    document.addEventListener("click", function (e) {
      /* a YouTube link: play it in the viewer with YouTube's privacy-enhanced player */
      var y = e.target.closest("[data-yt]");
      if (y) {
        e.preventDefault(); opener = y;
        if (!yt) {
          yt = document.createElement("iframe");
          yt.className = "yt"; yt.title = "Video";
          yt.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen"; yt.allowFullscreen = true;
          lb.querySelector("figure").insertBefore(yt, $("lbcap"));
        }
        im.hidden = true; vd.hidden = true; yt.hidden = false;
        yt.src = "https://www.youtube-nocookie.com/embed/" + y.getAttribute("data-yt") + "?autoplay=1&rel=0&playsinline=1";
        $("lbcap").textContent = y.getAttribute("data-cap") || "";
        lb.hidden = false; $("lbx").focus();
        return;
      }
      var b = e.target.closest(".shot"); if (!b) return;
      opener = b;
      if (yt) { yt.removeAttribute("src"); yt.hidden = true; }
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

  /* ---------- small signs of life ----------
     Skipped for visitors who ask their device for less motion. Hover effects
     only run with a mouse or trackpad; on phones a tap still opens the viewer. */
  var calm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mouse = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* Specimens: a clip plays in place on hover; stills get a magnifying loupe. */
  if (mouse) document.querySelectorAll("#scope .shot[data-i], #artgrid .shot[data-i]").forEach(function (b) {
    var o = shots[+b.getAttribute("data-i")], fr = b.querySelector(".frame"), img = fr.querySelector("img");
    if (o.video) {
      var v = null;
      b.addEventListener("mouseenter", function () {
        if (calm) return;
        if (!v) {
          v = document.createElement("video");
          v.className = "live"; v.muted = true; v.loop = true; v.playsInline = true; v.preload = "auto";
          v.setAttribute("aria-hidden", "true"); v.src = asset(o.video);
          fr.appendChild(v);
        }
        v.style.cssText = "left:" + img.offsetLeft + "px;top:" + img.offsetTop + "px;width:" + img.offsetWidth + "px;height:" + img.offsetHeight + "px";
        v.currentTime = 0;
        var p = v.play(); if (p && p.then) p.then(function () { v.classList.add("on"); }).catch(function () {});
      });
      b.addEventListener("mouseleave", function () { if (v) { v.classList.remove("on"); v.pause(); } });
    } else {
      var lens = document.createElement("div"), big = new Image(), Z = 2.6, R = 65;
      lens.className = "lens"; lens.setAttribute("aria-hidden", "true");
      big.src = asset(o.full || o.img);
      lens.style.backgroundImage = 'url("' + big.src + '")';
      fr.appendChild(lens);
      b.addEventListener("mousemove", function (e) {
        var r = img.getBoundingClientRect(), f = fr.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        if (x < 0 || y < 0 || x > r.width || y > r.height || !big.naturalWidth) { lens.classList.remove("on"); return; }
        /* the thumbnail may be cropped to fit (object-fit: cover), so line the zoom up with what's shown */
        var k = Math.max(r.width / big.naturalWidth, r.height / big.naturalHeight);
        var w = big.naturalWidth * k, h = big.naturalHeight * k, ox = (w - r.width) / 2, oy = (h - r.height) / 2;
        lens.style.left = (e.clientX - f.left) + "px"; lens.style.top = (e.clientY - f.top) + "px";
        lens.style.backgroundSize = (w * Z) + "px " + (h * Z) + "px";
        lens.style.backgroundPosition = (R - (x + ox) * Z) + "px " + (R - (y + oy) * Z) + "px";
        lens.classList.add("on"); b.classList.add("looking");
      });
      b.addEventListener("mouseleave", function () { lens.classList.remove("on"); b.classList.remove("looking"); });
    }
  });

  /* Sections ease in as they scroll into view, and margin-note arrows draw themselves. */
  if (!calm && "IntersectionObserver" in window) {
    var parts = Array.prototype.slice.call(document.querySelectorAll("section.part")).filter(function (s) {
      return s.getBoundingClientRect().top > window.innerHeight;   /* leave anything already on screen alone */
    });
    var rv = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.remove("later"); rv.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    parts.forEach(function (s) { s.classList.add("later"); rv.observe(s); });
  }
})();
