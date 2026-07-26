/* Sunrise Hostels — /reviews page controller.
   All reviews with search, sort, star-filter and pagination, plus a
   rating summary + distribution. Uses ReviewStore + ReviewUI. */
(function () {
  "use strict";

  var UI = window.ReviewUI, Store = window.ReviewStore;

  var state = { search: "", sort: "newest", stars: null, page: 1, pageSize: 6 };

  function els() {
    return {
      summary: document.getElementById("rp-summary"),
      stats: document.getElementById("rp-stats"),
      list: document.getElementById("rp-list"),
      pager: document.getElementById("rp-pager"),
      search: document.getElementById("rp-search"),
      sort: document.getElementById("rp-sort"),
      filters: document.getElementById("rp-filters"),
      count: document.getElementById("rp-count"),
    };
  }

  function renderList() {
    var e = els();
    e.list.innerHTML = UI.skeleton(state.pageSize);
    Store.query(state).then(function (res) {
      if (!res.reviews.length) {
        e.list.innerHTML = UI.empty(
          state.search || state.stars
            ? "No reviews match your filters."
            : "No reviews yet — be the first on Google!"
        );
        e.pager.innerHTML = "";
        e.count.textContent = "0 reviews";
        return;
      }
      e.list.innerHTML = UI.grid(res.reviews);
      UI.wireReadMore(e.list);
      requestAnimationFrame(function () {
        e.list.querySelectorAll(".reveal").forEach(function (n) { n.classList.add("in"); });
      });
      e.pager.innerHTML = UI.pagination(res.page, res.totalPages);
      wirePager(e.pager);
      var from = (res.page - 1) * res.pageSize + 1;
      var to = Math.min(res.total, res.page * res.pageSize);
      e.count.textContent = "Showing " + from + "–" + to + " of " + res.total + " review" + (res.total === 1 ? "" : "s");
    }).catch(function (err) {
      console.error("[Sunrise Reviews] page load failed:", err);
      e.list.innerHTML = UI.error();
      e.pager.innerHTML = "";
    });
  }

  function wirePager(pager) {
    pager.querySelectorAll(".gr-pager__btn[data-page]").forEach(function (btn) {
      if (btn.disabled) return;
      btn.addEventListener("click", function () {
        var p = parseInt(btn.getAttribute("data-page"), 10);
        if (p && p !== state.page) {
          state.page = p;
          renderList();
          document.getElementById("rp-list").scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  function renderSummary() {
    var e = els();
    Store.getStats().then(function (stats) {
      Store.getProfileUrls().then(function (urls) {
        e.summary.innerHTML = UI.summary(stats, {
          tagline: "Every review below is from our residents and their families on Google.",
          writeUrl: urls.writeReviewUrl,
          viewAllUrl: urls.profileUrl,
          viewAllExternal: true, // on the reviews page, "View all" goes to Google
        });
        requestAnimationFrame(function () {
          e.summary.querySelectorAll(".reveal").forEach(function (n) { n.classList.add("in"); });
        });
      });
      e.stats.innerHTML = UI.statistics(stats);
    });
  }

  function initControls() {
    var e = els();

    // Search (debounced)
    var t;
    e.search.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () { state.search = e.search.value; state.page = 1; renderList(); }, 300);
    });

    // Sort
    e.sort.addEventListener("change", function () {
      state.sort = e.sort.value; state.page = 1; renderList();
    });

    // Star filters
    e.filters.querySelectorAll("[data-stars]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var val = btn.getAttribute("data-stars");
        var num = val === "all" ? null : parseInt(val, 10);
        state.stars = (state.stars === num) ? null : num; // toggle off
        state.page = 1;
        e.filters.querySelectorAll("[data-stars]").forEach(function (b) { b.classList.remove("is-active"); });
        if (state.stars === null) {
          e.filters.querySelector('[data-stars="all"]').classList.add("is-active");
        } else {
          btn.classList.add("is-active");
        }
        renderList();
      });
    });
  }

  function boot() {
    if (!UI || !Store || !document.getElementById("rp-list")) return;
    initControls();
    renderSummary();
    renderList();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
