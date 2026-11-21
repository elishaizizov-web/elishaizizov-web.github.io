/*
  HOME LANDING: sign-ups for guides, WhatsApp community and podcast.

  HOW TO GO LIVE WITH A GUIDE
  1. Put the PDF in the repository, for example /guides/zeitmanagement.pdf
  2. Enter its path below. The card then switches from "Bald" to "Gratis"
     and the visitor gets the download link right after entering an email.

  HOW TO OPEN THE WHATSAPP COMMUNITY
  Enter the invite link in whatsappUrl. The card then shows a join button.
*/
window.SITE_CONFIG = window.SITE_CONFIG || {
  whatsappUrl: '',
  guides: {
    zeit: '',      // e.g. '/guides/zeitmanagement.pdf'
    koscher: '',   // e.g. '/guides/koscher-einkaufen.pdf'
    insekten: ''   // e.g. '/guides/insekten-check.pdf'
  }
};

(function () {
  var cfg = window.SITE_CONFIG;

  // German only: other languages fall back to the German strings.
  function tr() {
    var cur = (window.T && T[getLang()]) || {};
    return new Proxy(cur, { get: function (o, k) { return o[k] || T.de[k]; } });
  }

  // Save the address in Firestore. Tries with a "source" field first and, if the
  // security rules reject the extra field, once more with the plain newsletter shape.
  function saveLead(email, source) {
    if (!(window.firebase && firebase.firestore)) return Promise.reject(new Error('no-firebase'));
    var col = firebase.firestore().collection('newsletterSubscribers');
    var base = {
      email: email,
      subscribed_at: firebase.firestore.FieldValue.serverTimestamp(),
      is_active: true
    };
    return col.add(Object.assign({ source: source }, base)).catch(function () {
      return col.add(base);
    });
  }

  window.leadSubscribe = function (e) {
    e.preventDefault();
    var form = e.target;
    var input = form.querySelector('input[type="email"]');
    var btn = form.querySelector('button[type="submit"]');
    var msg = form.querySelector('.lead-msg');
    var email = (input.value || '').trim().toLowerCase();
    if (!email) return;
    var source = form.getAttribute('data-source') || 'home';
    var guideId = form.getAttribute('data-guide');
    var file = guideId && cfg.guides ? cfg.guides[guideId] : '';
    var t = tr();

    btn.disabled = true;
    msg.className = 'lead-msg';
    msg.textContent = '';

    saveLead(email, source).then(function () {
      input.value = '';
      msg.className = 'lead-msg show';
      if (file) {
        msg.textContent = t['lead-ok-file'] + ' ';
        var a = document.createElement('a');
        a.href = file;
        a.setAttribute('download', '');
        a.textContent = t['lead-dl'];
        msg.appendChild(a);
      } else {
        msg.textContent = t['lead-ok'];
      }
    }).catch(function () {
      msg.className = 'lead-msg show err';
      msg.textContent = t['lead-err'];
    }).then(function () {
      btn.disabled = false;
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    var changed = false;

    // Guides that have a file: show "Gratis" and the download button text.
    document.querySelectorAll('[data-guide-card]').forEach(function (card) {
      var id = card.getAttribute('data-guide-card');
      if (!cfg.guides || !cfg.guides[id]) return;
      var chip = card.querySelector('.f-chip');
      var btn = card.querySelector('button[type="submit"]');
      if (chip) chip.setAttribute('data-t', 'g-chip-free');
      if (btn) btn.setAttribute('data-t', 'lead-btn-guide');
      changed = true;
    });

    // WhatsApp: with a link show the join button, otherwise keep the waitlist form.
    var wa = document.getElementById('wa-card');
    if (wa && cfg.whatsappUrl) {
      var join = wa.querySelector('.wa-join');
      var form = wa.querySelector('.lead-form');
      var chip = wa.querySelector('.f-chip');
      if (join) { join.href = cfg.whatsappUrl; join.hidden = false; }
      if (form) form.hidden = true;
      if (chip) chip.hidden = true;
    }

    if (changed && typeof setLang === 'function') setLang(getLang());
  });
})();
