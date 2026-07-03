export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const target = url.searchParams.get('url');
  
  if (!target) {
    return new Response('missing url', { status: 400 });
  }

  const targetUrl = decodeURIComponent(target);
  const isSina = targetUrl.includes('sinajs.cn') || targetUrl.includes('sina.cn');
  
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Referer': isSina ? 'https://finance.sina.com.cn' : 'https://www.eastmoney.com',
  };
  if (isSina) headers['Host'] = 'hq.sinajs.cn';

  const res = await fetch(targetUrl, { headers });
  const buffer = await res.arrayBuffer();
  const decoder = new TextDecoder(isSina ? 'gbk' : 'utf-8');
  const text = decoder.decode(buffer);

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
    }
  });
}
