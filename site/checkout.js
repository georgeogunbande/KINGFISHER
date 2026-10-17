/*
  Checkout links for georgeogunbande.com
  ------------------------------------------------------------
  Paste each Stripe Payment Link between the quotes. Every "Buy"
  button on the site updates automatically. Until a link is added,
  that button opens a pre-filled order email instead.
*/
var CHECKOUT = {
  smbb:   "https://buy.stripe.com/fZueVccCBgKX0IAerza7C01",     // Small Money, Big Brand — $19.99 + $10 shipping
  tales:  "https://buy.stripe.com/5kQbJ00TT2U7bneabja7C00",     // Tales Told by an Idiot — $19.99 + $10 shipping
  maya:   "https://buy.stripe.com/dRmbJ0gSR7an76Yerza7C02",     // Maya the Mini Mogul — $12.99 + $10 shipping
  bundle: "https://buy.stripe.com/3cI14mbyx1Q31ME97fa7C03"       // Three-book bundle — $49 + $10 shipping
};

(function () {
  document.querySelectorAll('[data-buy]').forEach(function (a) {
    var url = CHECKOUT[a.getAttribute('data-buy')];
    if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
  });
})();
