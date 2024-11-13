# Strapi Upload Provider for Digital Ocean Spaces
- This provider is a fork of [AdamZikmund's](https://github.com/AdamZikmund) [strapi upload provider](https://github.com/AdamZikmund/strapi-provider-upload-digitalocean) for Digital Ocean spaces.

This provider will upload to the space using the AWS S3 API.

## Parameters
- **key** : [Space access key](https://cloud.digitalocean.com/account/api/tokens)
- **secret** : [Space access secret](https://cloud.digitalocean.com/account/api/tokens)
- **endpoint** : Base URL of the space (e.g. `https://fra.digitaloceanspaces.com`)
- **space** : Name of the space in the Digital Ocean panel. (e.g. `myspace`)
- **directory** : Name of the sub-directory you want to store your files in. (Optionnal - e.g. `/example`)
- **cdn** : CDN Endpoint - URL of the cdn of the space (Optionnal - e.g. `https://fra.cdn.digitaloceanspaces.com`)

## How to use

### 1. Install this package

```bash
npm i strapi-provider-upload-digitalocean
```

### 2. Create or update config in `./config/plugins.js` with content

```js
module.exports = ({env}) => ({
  // ...
  upload: {
    config: {
      provider: "strapi-provider-upload-digitalocean",
      providerOptions: {
        key: env('DO_SPACE_ACCESS_KEY'),
        secret: env('DO_SPACE_SECRET_KEY'),
        endpoint: env('DO_SPACE_ENDPOINT'),
        space: env('DO_SPACE_BUCKET'),
        directory: env('DO_SPACE_DIRECTORY'),
        cdn: env('DO_SPACE_CDN'),
      }
    },
  },
  // ...
})

```

### 3. Create `.env` and add provide Digital Ocean config.

```bash
DO_SPACE_ACCESS_KEY=
DO_SPACE_SECRET_KEY=
DO_SPACE_ENDPOINT=
DO_SPACE_BUCKET=
DO_SPACE_DIRECTORY=  #Optional
DO_SPACE_CDN=        #Optional
```

### 4. Change security setting in middleware.js to allow image thumbnails beeing loaded in strapi dashboard

```js
module.exports = ({ env }) => ({
  // ...
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            "<you digital ocean space endpoint or cdn domain>",
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "<you digital ocean space endpoint or cdn domain>",
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  // ...
})
```

## Links

- [MIT License](LICENSE.md)
- [Strapi website](http://strapi.io/)
