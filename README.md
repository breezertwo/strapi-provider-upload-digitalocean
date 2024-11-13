# Strapi Upload Provider for Digital Ocean Spaces
- This provider is a fork of [AdamZikmund's](https://github.com/AdamZikmund) [strapi upload provider](https://github.com/AdamZikmund/strapi-provider-upload-digitalocean) for Digital Ocean spaces.

This provider will upload to the space using the AWS S3 API.
Strapi v5 ready and AWS Client SDK v3.

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
npm i @breezertwo/strapi-provider-upload-digitalocean
```

### 2. Create or update config in `./config/plugins.js` of your strapi project

```js
module.exports = ({env}) => ({
  // ...
  upload: {
    config: {
      provider: "@breezertwo/strapi-provider-upload-digitalocean",
      providerOptions: {
        key: env('DO_SPACE_ACCESS_KEY'),
        secret: env('DO_SPACE_SECRET_KEY'),
        endpoint: env('DO_SPACE_ENDPOINT'),
        space: env('DO_SPACE_BUCKET'),
        region: env('DO_SPACE_REGION'),
        directory: env('DO_SPACE_DIRECTORY'),
        cdn: env('DO_SPACE_CDN'),
      }
    },
  },
  // ...
})

```

### 3. Create or modify `.env` and add Digital Ocean env variables.

```bash
DO_SPACE_ACCESS_KEY=
DO_SPACE_SECRET_KEY=
DO_SPACE_ENDPOINT=
DO_SPACE_BUCKET=
DO_SPACE_REGION=     #Optional (defaults to fra1)
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
