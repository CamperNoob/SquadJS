import https from 'https';

export default async function getCountryByIP(ip) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.country.is',
      path: `/${ip}`,
      method: 'GET',
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        // console.debug('Non-success status:', res.statusCode);
        return resolve(null);
      }

      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const country = json.country;
          const flag = country.toUpperCase().split('').map(char => String.fromCodePoint(char.charCodeAt(0) + 127397)).join('') || '';
          resolve(country + flag);
        } catch (e) {
          // console.debug('JSON parse error:', e);
          resolve(null);
        }
      });
    });

    req.on('error', (err) => {
      // console.debug('Request error:', err);
      resolve(null);
    });

    req.end();
  });
}