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
