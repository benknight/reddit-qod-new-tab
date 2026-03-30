// Because I fucking hate dumb quotes.
// Regexes stolen from https://github.com/kellym/smartquotesjs/blob/master/src/smartquotes.js
function smartQuotes(str) {
  return str
    .replace(/(\W|^)"(\S)/g, '$1\u201c$2') // beginning "
    .replace(/(\u201c[^"]*)"([^"]*$|[^\u201c"]*\u201c)/g, '$1\u201d$2') // ending "
    .replace(/([^0-9])"/g, '$1\u201d') // remaining " at end of word
    .replace(/(\W|^)'(\S)/g, '$1\u2018$2') // beginning '
    .replace(/([a-z])'([a-z])/gi, '$1\u2019$2') // conjunction's possession
    .replace(/((\u2018[^']*)|[a-z])'([^0-9]|$)/gi, '$1\u2019$3') // ending '
    .replace(
      /(\u2018)([0-9]{2}[^\u2019]*)(\u2018([^0-9]|$)|$|\u2019[a-z])/gi,
      '\u2019$2$3'
    ) // abbrev. years like '93
    .replace(
      /(\B|^)\u2018(?=([^\u2019]*\u2019\b)*([^\u2019\u2018]*\W[\u2019\u2018]\b|[^\u2019\u2018]*$))/gi,
      '$1\u2019'
    ) // backwards apostrophe
    .replace(/'''/g, '\u2034') // triple prime
    .replace(/("|'')/g, '\u2033') // double prime
    .replace(/'/g, '\u2032'); // prime
}

// Convert ugly hyphens to erotic dashes
function hyphenToDash(str) {
  return str
    .replace(/ - /g, ' – ')
    .replace(/ -- /g, ' – ')
    .replace(/"- /g, '" – ')
    .replace(/\n-/g, ' – ');
}

// Set font size based on word length
function setFontSizes($quote) {
  const numWords = $quote.innerText.split(' ').length;
  if (numWords >= 1 && numWords < 20) {
    $quote.style.fontSize = '125%';
  } else if (numWords >= 20 && numWords < 40) {
    $quote.style.fontSize = '100%';
  } else if (numWords >= 40 && numWords < 60) {
    $quote.style.fontSize = '75%';
  } else {
    $quote.style.fontSize = '50%';
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

// --- r/quotes ---

// show a random quote from the top 3 hot posts on r/quotes.
// cache is broken once an hour

const qodURL1 =
  'https://www.reddit.com/r/quotes/.json?v=' +
  new Date().toISOString().slice(0, 13);

fetch(qodURL1).then(r => r.json()).then((resp) => {
  const $quote = document.querySelector('#quote-0');
  const filteredQuotes = resp.data.children.filter((quote) => {
    return !quote.data.stickied;
  });
  const quoteData = filteredQuotes[getRandomInt(0, 3)].data;

  const cite = document.createElement('cite');
  cite.textContent = `u/${quoteData.author}`;

  const a = document.createElement('a');
  a.href = quoteData.url;
  a.textContent = smartQuotes(hyphenToDash(quoteData.title));

  const p = document.createElement('p');
  p.appendChild(a);

  $quote.replaceChildren(cite, p);
  setFontSizes($quote);
});
