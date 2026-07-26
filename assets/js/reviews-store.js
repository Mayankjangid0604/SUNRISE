/* Sunrise Hostels — reviews data store (frontend, no backend).
   ---------------------------------------------------------------------
   Single source of truth for review data. Loads assets/data/reviews.json
   once (cached), then serves the same shapes a REST API would return:

     Store.getStats()                    -> { average, total, distribution }
     Store.getLatest(n)                  -> Review[]
     Store.query({ search, sort, stars, page, pageSize })
                                         -> { reviews, page, pageSize, total, totalPages }
     Store.getProfileUrls()             -> { profileUrl, writeReviewUrl }

   To go backend-driven later (Google Business Profile sync → Postgres →
   REST API), replace `load()` below with fetch('/api/reviews…') — nothing
   else in the UI needs to change. */
(function () {
  "use strict";

  var DATA_URL = "assets/data/reviews.json";
  var cache = null;
  var loadPromise = null;

  function load() {
    if (cache) return Promise.resolve(cache);
    if (loadPromise) return loadPromise;
    loadPromise = fetch(DATA_URL, { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("reviews.json HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        var reviews = (data.reviews || []).map(normalize);
        cache = {
          reviews: reviews,
          profileUrl: data.profileUrl || "",
          writeReviewUrl: data.writeReviewUrl || data.profileUrl || "",
        };
        return cache;
      });
    return loadPromise;
  }

  function normalize(r) {
    return {
      reviewId: String(r.reviewId || ""),
      authorName: String(r.authorName || "Anonymous"),
      authorPhoto: r.authorPhoto || "",
      rating: Math.max(1, Math.min(5, Math.round(Number(r.rating) || 0))),
      reviewText: String(r.reviewText || ""),
      relativeTime: String(r.relativeTime || ""),
      publishTime: r.publishTime || null,
      language: r.language || "en",
      profileUrl: r.profileUrl || "",
      isVerified: !!r.isVerified,
    };
  }

  function computeStats(reviews) {
    var total = reviews.length;
    var distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    var sum = 0;
    reviews.forEach(function (r) { sum += r.rating; distribution[r.rating]++; });
    return {
      total: total,
      average: total ? Math.round((sum / total) * 10) / 10 : 0,
      distribution: distribution,
    };
  }

  function byTime(a, b) {
    return new Date(b.publishTime || 0) - new Date(a.publishTime || 0);
  }

  var Store = {
    getStats: function () {
      return load().then(function (c) { return computeStats(c.reviews); });
    },

    getLatest: function (n) {
      n = n || 5;
      return load().then(function (c) {
        return c.reviews.slice().sort(byTime).slice(0, n);
      });
    },

    getProfileUrls: function () {
      return load().then(function (c) {
        return { profileUrl: c.profileUrl, writeReviewUrl: c.writeReviewUrl };
      });
    },

    query: function (opts) {
      opts = opts || {};
      var search = (opts.search || "").trim().toLowerCase();
      var sort = opts.sort || "newest";
      var stars = opts.stars || null; // number 1..5 or null
      var page = Math.max(1, parseInt(opts.page, 10) || 1);
      var pageSize = Math.max(1, parseInt(opts.pageSize, 10) || 6);

      return load().then(function (c) {
        var list = c.reviews.slice();

        if (stars) list = list.filter(function (r) { return r.rating === stars; });
        if (search) {
          list = list.filter(function (r) {
            return r.authorName.toLowerCase().indexOf(search) !== -1 ||
                   r.reviewText.toLowerCase().indexOf(search) !== -1;
          });
        }

        switch (sort) {
          case "oldest": list.sort(function (a, b) { return -byTime(a, b); }); break;
          case "highest": list.sort(function (a, b) { return b.rating - a.rating || byTime(a, b); }); break;
          case "lowest": list.sort(function (a, b) { return a.rating - b.rating || byTime(a, b); }); break;
          default: list.sort(byTime); // newest
        }

        var total = list.length;
        var totalPages = Math.max(1, Math.ceil(total / pageSize));
        page = Math.min(page, totalPages);
        var start = (page - 1) * pageSize;

        return {
          reviews: list.slice(start, start + pageSize),
          page: page, pageSize: pageSize, total: total, totalPages: totalPages,
        };
      });
    },
  };

  window.ReviewStore = Store;
})();
