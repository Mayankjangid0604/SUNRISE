/* Sunrise Hostels — interactivity
   Template № 100 "The Saahvik Standard" build. */
(function () {
  "use strict";

  var WA = "919602114011";

  function waLink(msg) {
    return "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg);
  }

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".d-nav__toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- booking bar → WhatsApp ---------- */
  var bar = document.getElementById("booking-bar");
  if (bar) {
    bar.addEventListener("submit", function (e) {
      e.preventDefault();
      var wing = bar.wing.value, room = bar.room.value, when = bar.when.value;
      var msg =
        "Hi Sunrise Hostels, I'd like to check availability.\n" +
        "Wing: " + wing + "\nRoom type: " + room + "\nMove-in: " + when;
      window.open(waLink(msg), "_blank", "noopener");
    });
  }

  /* ---------- enquiry form → WhatsApp ---------- */
  var form = document.getElementById("enquiry-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (form.name.value || "").trim();
      var phone = (form.phone.value || "").trim();
      var msg =
        "Hi Sunrise Hostels, please call me back.\n" +
        "Name: " + name + "\nPhone: " + phone;
      window.open(waLink(msg), "_blank", "noopener");
    });
  }

  /* ---------- photo loader ----------
     Elements carry data-img="base1|base2" (paths without extension).
     Tries each base with common extensions; first image that loads is
     dropped into the tile. If none load, the styled placeholder stays. */
  var EXTS = [".webp", ".jpg", ".jpeg", ".png"];
  function loadInto(el, bases, bi, ei) {
    if (bi >= bases.length) return;
    if (ei >= EXTS.length) return loadInto(el, bases, bi + 1, 0);
    var src = bases[bi] + EXTS[ei];
    var img = new Image();
    img.decoding = "async";
    img.onload = function () {
      img.className = "loaded-photo";
      img.alt = "";
      el.insertBefore(img, el.firstChild);
      el.classList.add("has-photo");
    };
    img.onerror = function () { loadInto(el, bases, bi, ei + 1); };
    img.src = encodeURI(src);
  }
  var imgTiles = Array.prototype.slice.call(document.querySelectorAll("[data-img]"));
  if ("IntersectionObserver" in window) {
    // Only fetch a tile's photo when it nears the viewport — keeps the
    // initial page load light even with a large gallery.
    var imgIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        imgIO.unobserve(en.target);
        loadInto(en.target, en.target.getAttribute("data-img").split("|"), 0, 0);
      });
    }, { rootMargin: "300px 0px" });
    imgTiles.forEach(function (el) { imgIO.observe(el); });
  } else {
    imgTiles.forEach(function (el) {
      loadInto(el, el.getAttribute("data-img").split("|"), 0, 0);
    });
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- scroll reveal ---------- */
  if ("IntersectionObserver" in window) {
    document.documentElement.classList.add("reveal-on");
    var els = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
    // safety net: never leave content hidden
    setTimeout(function () {
      els.forEach(function (el) { el.classList.add("in"); });
    }, 1600);
  }
})();
