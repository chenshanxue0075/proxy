export default async function handler(req, res) {
  const target = req.query.url;
  
  if (!target) {
    return res.status(400).send('missing url');
  }

  const targetUrl = decodeURIComponent(target);
  const isSina = targetUrl.includes('sinajs.cn') || targetUrl.includes('sina.cn');
  
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Referer': isSina ? 'https://finance.sina.com.cn' : 'https://www.eastmoney.com',
  };
  if (isSina) headers['Host'] = 'hq.sinajs.cn';

  try {
    const response = await fetch(targetUrl, { headers });
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder(isSina ? 'gbk' : 'utf-8');
    const text = decoder.decode(buffer);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Content-Type', 'text/plain;charset=utf-8');
    res.status(200).send(text);
  } catch (e) {
    res.status(500).send('proxy error: ' + e.message);
  }
}
