#!/usr/bin/env node

const meow = require('meow')
const dnslink = require('.')

const flags = {
  link: { alias: 'l' },
  domain: { alias: 'd' },
  record: { alias: 'r', default: '_dnslink' },
  sandbox: { type: 'boolean' },
  ttl: { inferType: true, default: 60 }
}

const cli = meow(`
  USAGE
      DNSIMPLE_TOKEN=trustno1 dnslink-dnsimple -d <domain-name> -l <dnslink-value>
  OPTIONS
      -l, --link  <string>    dnslink value, eg. ipfs path (required)
      -d, --domain <string>   dnsimple domain name (required)
      -r, --record <string>   domain record name (default: "_dnslink")
      --ttl <int>             set the ttl of the record (default: 60)
      --sandbox               use the dnsimple sandbox api
      --help                  show this documentation
  EXAMPLES
      DNSIMPLE_TOKEN=$(cat token) dnslink-dnsimple -d domain.net -l /ipns/ipfs.io
`, { flags })

async function run () {
  const token = process.env.DNSIMPLE_TOKEN
  if (!token && !cli.flags.link && !cli.flags.domain) {
    cli.showHelp()
  }
  if (!token) {
    return console.error('Error: DNSIMPLE_TOKEN must be set as an environment variable')
  }
  if (!cli.flags.link || !cli.flags.domain) {
    return console.error('Error: --link and --domain are flags are required')
  }

  // DO IT!
  try {
    const { record } = await dnslink(token, cli.flags)
    console.log(`Updated DNSLink on ${record.zone_id} to ${record.content}`)
  } catch (err) {
    return console.error(err.message || err)
  }
}

run()
