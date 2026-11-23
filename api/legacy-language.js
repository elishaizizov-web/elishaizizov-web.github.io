// Old language selectors all lead to the German homepage.
module.exports = function redirectLegacyLanguage(request, response) {
  const params = new URL(request.url, 'https://elishaizizov.com').searchParams;
  params.delete('lang');
  const query = params.toString();
  response.writeHead(308, { Location: query ? '/?' + query : '/' });
  response.end();
};
