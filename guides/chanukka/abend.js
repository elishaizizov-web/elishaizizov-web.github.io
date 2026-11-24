const chooser = document.querySelector('.abendwahl');
const select = chooser.querySelector('select');
const nights = Array.from(document.querySelectorAll('.chanukka-table tbody tr'));
const calendar = document.querySelector('.abend-kalender');

function showNight() {
  const row = nights[select.selectedIndex];
  const count = select.selectedIndex + 1;
  const timing = row.querySelector('small')?.textContent;
  chooser.querySelector('.abend-lichter').textContent =
    (count === 1 ? '1 Licht' : count + ' Lichter') + ' und der Schamasch';
  chooser.querySelector('.abend-bild').replaceChildren(row.querySelector('.chanukka-diagram').cloneNode(true));
  const first = count === 1 ? 'Beginne ganz rechts.' : 'Beginne beim neuen Licht links und zünde nach rechts weiter.';
  chooser.querySelector('.abend-hinweis').textContent = [
    first,
    count === 1 ? 'Sprich vorher alle drei Segenssprüche.' : 'Sprich vorher die ersten beiden Segenssprüche.',
    timing === 'Vor Schabbat' ? 'Heute vor den Schabbatkerzen anzünden.' : '',
    timing === 'Nach Schabbat' ? 'Heute erst nach Schabbatausgang anzünden.' : ''
  ].filter(Boolean).join(' ');
}

nights.forEach((row, i) => {
  select.add(new Option((i + 1) + '. Abend · ' + row.querySelector('time').textContent));
});
showNight();
select.addEventListener('change', showNight);
calendar.open = false;
chooser.hidden = false;

const format = document.querySelector('#lesefassung');
function updateReading() {
  document.querySelectorAll('.chanukka-hebrew').forEach(line => { line.hidden = format.value === 'de'; });
  document.querySelectorAll('.chanukka-reading').forEach(line => { line.hidden = format.value === 'he'; });
}
format.addEventListener('change', updateReading);
format.parentElement.hidden = false;
updateReading();

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const pauseLights = document.querySelector('.pause-lights');
const flames = [...document.querySelectorAll('.chanukkia .flame')];
let lighting = [];
function startLights() {
  lighting.forEach(animation => animation.cancel());
  lighting = [];
  pauseLights.hidden = reducedMotion.matches;
  pauseLights.textContent = 'Animation pausieren';
  if (reducedMotion.matches) return;
  lighting = flames.map(flame => {
    const ignition = (0.65 + parseFloat(flame.style.getPropertyValue('--on'))) / 9;
    return flame.animate([
      { opacity: 0, offset: 0 }, { opacity: 0, offset: ignition },
      { opacity: 1, offset: ignition + 0.04 }, { opacity: 1, offset: 0.92 }, { opacity: 0, offset: 1 }
    ], { duration: 9000, iterations: Infinity });
  });
}
pauseLights.addEventListener('click', () => {
  const paused = lighting[0]?.playState === 'paused';
  lighting.forEach(animation => paused ? animation.play() : animation.pause());
  pauseLights.textContent = paused ? 'Animation pausieren' : 'Animation fortsetzen';
});
reducedMotion.addEventListener('change', startLights);
startLights();
