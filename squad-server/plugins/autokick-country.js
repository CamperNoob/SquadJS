import getCountryByIP from '../utils/ip-api.js'

import BasePlugin from './base-plugin.js';

export default class AutokickCountry extends BasePlugin {
  static get description() {
    return (
      'The <code>AutokickCountry</code> plugin can be configured to automatically kick players ' +
      'with ip from configured country.'
    );
  }

  static get defaultEnabled() {
    return false;
  }

  static get optionsSpecification() {
    return {
      countryCode: {
        required: true,
        description: 'Two letter ISO code of country to be autokicked',
        default: 'RU'
      },
      kickMessage: {
        required: true,
        description: 'Message to show to kicked player',
        default: 'This server does not allow VPN usage'
      },
      includeCountryInKickMessage: {
        required: false,
        description: 'Include countryCode variable at the end of kick message or not',
        default: false
      }
    };
  }

  constructor(server, options, connectors) {
    super(server, options, connectors);

    this.onPlayerConnected = this.onPlayerConnected.bind(this);
  }

  async mount() {
    this.server.on('PLAYER_CONNECTED', this.onPlayerConnected);
  }

  async unmount() {
    this.server.removeEventListener('PLAYER_CONNECTED', this.onPlayerConnected);
  }

  async onPlayerConnected(info) {
      let CountryCodeAndFlag = await getCountryByIP(info.ip);
      let CountryCode = CountryCodeAndFlag?.slice(0, 2) || null;
      if(CountryCode == this.options.countryCode) {
        await this.server.rcon.execute('AdminKick '.concat(info.player.name).concat(` "${this.options.kickMessage}${this.options.includeCountryInKickMessage ? ' '.concat(this.options.countryCode) : ''}"`));
      }
    }
}