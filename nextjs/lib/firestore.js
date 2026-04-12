const PROJECT_ID = 'elishai-zizov';
const API_KEY    = 'AIzaSyDmEpaog0ZVYI4ZU87IfcjiSbRizQITn5o';

function parseValue(v) {
  if (!v) return null;
  if (v.stringValue    !== undefined) return v.stringValue;
  if (v.integerValue   !== undefined) return parseInt(v.integerValue, 10);
  if (v.doubleValue    !== undefined) return parseFloat(v.doubleValue);
  if (v.booleanValue   !== undefined) return v.booleanValue;
  if (v.nullValue      !== undefined) return null;
  if (v.arrayValue)  return (v.arrayValue.values || []).map(parseValue);
  if (v.mapValue) {
    const obj = {};
    for (const [k, val] of Object.entries(v.mapValue.fields || {}))
      obj[k] = parseValue(val);
    return obj;
  }
  return null;
}

function parseDoc(doc) {
  const obj = { id: doc.name.split('/').pop() };
  for (const [k, v] of Object.entries(doc.fields || {}))
    obj[k] = parseValue(v);
  return obj;
}

export async function fetchAllArticles() {
  const base = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/articles?key=${API_KEY}&pageSize=300`;
  const docs = [];
  let token = null;
  do {
    const url = token ? `${base}&pageToken=${token}` : base;
    const res  = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();
    if (data.error) throw new Error('Firestore: ' + JSON.stringify(data.error));
    if (data.documents) docs.push(...data.documents.map(parseDoc));
    token = data.nextPageToken || null;
  } while (token);

  // Sort newest first by date (DD.MM.YYYY)
  docs.sort((a, b) => {
    const parse = d => d ? d.split('.').reverse().join('') : '';
    return parse(b.date).localeCompare(parse(a.date));
  });
  return docs;
}
