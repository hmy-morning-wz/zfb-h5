
import openLine from '../utils/data/openLine';
import cityConfig from '../utils/data/cityConfig';
import faq from '../utils/data/faq';

module.exports = {
  'GET /js/config/ebus/330000/faq.json': faq['330000'],
  'GET /js/config/ebus/330000/lines.json': openLine['330000'],
  'GET /js/config/ebus/330000/config.json': cityConfig['330000'],

  'GET /js/config/ebus/330000/faq.js': (req, res) => { res.end(`window.ebusConfig.faq = ${JSON.stringify(faq['330000'])}`); },
  'GET /js/config/ebus/330000/lines.js': (req, res) => { res.end(`window.ebusConfig.openline = ${JSON.stringify(openLine['330000'])}`); },
  'GET /js/config/ebus/330000/config.js': (req, res) => { res.end(`window.ebusConfig.city = ${JSON.stringify(cityConfig['330000'])}`); },
};
