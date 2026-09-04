/* hmm design system. The smallest possible h() for static SVG.
   machines.js and the section schematics build their drawings as h(tag, props,
   ...children) trees and hand them to a mount. That used to go through React
   and ReactDOM, ~140 KB of script to set attributes on elements that never
   re-render. This does the same job in forty lines and produces the same DOM:
   the SVG serialisation of every icon, blow-out and schematic was captured under
   React and compared against this after the swap.

     var el = hmmH("g", {className:"blk", tabIndex:0, onClick:fn}, child, [more]);
     hmmRender(mount, el);      // replaces the mount's children with el

   Prop rules follow React's for SVG: className -> class, tabIndex -> tabindex,
   camelCase presentation props -> kebab-case attributes (strokeWidth ->
   stroke-width), viewBox stays as it is, style takes an object, on* props become
   listeners, key is ignored, and null/false/undefined children are skipped. */
(function () {
  var NS = "http://www.w3.org/2000/svg";
  var KEEP = { viewBox: 1 };
  var RENAME = { className: "class", tabIndex: "tabindex" };
  function attrName(k) {
    if (RENAME[k]) return RENAME[k];
    if (KEEP[k] || k.indexOf("-") >= 0) return k;
    return k.replace(/[A-Z]/g, function (c) { return "-" + c.toLowerCase(); });
  }
  function append(el, child) {
    if (child == null || child === false || child === true) return;
    if (Array.isArray(child)) { for (var i = 0; i < child.length; i++) append(el, child[i]); return; }
    if (typeof child === "string" || typeof child === "number") { el.appendChild(document.createTextNode(String(child))); return; }
    el.appendChild(child);
  }
  window.hmmH = function (tag, props) {
    var el = document.createElementNS(NS, tag);
    if (props) for (var k in props) {
      if (!Object.prototype.hasOwnProperty.call(props, k) || k === "key") continue;
      var v = props[k];
      if (v == null) continue;
      if (k === "style" && typeof v === "object") { for (var s in v) el.style[s] = v[s]; }
      else if (k.slice(0, 2) === "on" && typeof v === "function") el.addEventListener(k.slice(2).toLowerCase(), v);
      else el.setAttribute(attrName(k), v);
    }
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  };
  window.hmmRender = function (mount, el) { mount.replaceChildren(el); };
})();
