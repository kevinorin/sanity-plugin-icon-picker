import { showIncompatiblePluginDialog } from '@sanity/incompatible-plugin'
import { name, version } from './package.json'

export default showIncompatiblePluginDialog({
  name,
  versions: {
    v3: version,
    v2: '^1.4.13'
  },
  sanityExchangeUrl: 'https://www.sanity.io/plugins/sanity-plugin-media'
})