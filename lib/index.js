"use strict";
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const URI = require('urijs');
const crypto = require('crypto');

class FileLocationConverter {
  constructor(config) {
    this.config = config;
  }

  getKey(file) {
    const filename = `${file.hash}${file.ext}`;
    if (!this.config.directory) return filename;
    return `${this.config.directory}/${filename}`;
  }

  getUrl(data) {
    var parts = {};
    URI.parse(this.config.cdn ?? this.config.endpoint, parts);
    parts.protocol = "https"; // force https
    parts.path = data
    return URI.build(parts);
  }
}

module.exports = {
  provider: "do",
  name: "Digital Ocean Spaces",
  auth: {
    key: {
      label: "Key",
      type: "text"
    },
    secret: {
      label: "Secret",
      type: "text"
    },
    endpoint: {
      label: "Endpoint (e.g. 'fra1.digitaloceanspaces.com')",
      type: "text",
    },
    cdn: {
      label: "CDN Endpoint (Optional - e.g. 'https://cdn.space.com')",
      type: "text",
    },
    space: {
      label: "Space (e.g. myspace)",
      type: "text",
    },
    directory: {
      label: 'Directory (Optional - e.g. directory - place when you want to save files)',
      type: 'text'
    }
  },
  init: config => {
    const converter = new FileLocationConverter(config);
    const s3Client = new S3Client({
        endpoint: config.endpoint,
        forcePathStyle: false,
        region: "fra1",
        credentials: {
          accessKeyId: config.key,
          secretAccessKey: config.secret
        }
    });

    const upload = file => new Promise((resolve, reject) => {
      file.hash = crypto.createHash('md5').update(file.hash).digest("hex");
      s3Client.send(new PutObjectCommand({
          Bucket: config.space,
          Key: converter.getKey(file),
          Body: Buffer.from(file.buffer, "binary"),
          ContentType: file.mime,
          ACL: 'public-read',
          CacheControl: 'public, max-age=31536000, immutable'
        })).then(data => {
        file.url = converter.getUrl(converter.getKey(file));
        delete file.buffer;
        resolve();
      }).catch(err => {
        reject(err);
      });
    });

    return {
      upload,
      uploadStream: file => new Promise((resolve, reject) => {
        const _buf = [];
        file.stream.on('data', chunk => _buf.push(chunk));
        file.stream.on('end', () => {
          file.buffer = Buffer.concat(_buf);
          resolve(upload(file));
        });
        file.stream.on('error', err => reject(err));
      }),
      delete: file => new Promise((resolve, reject) => {
        const command = new DeleteObjectCommand({
          Bucket: config.space,
          Key: converter.getKey(file),
        });
        s3Client.send(command).then(data => {
            resolve();
          }).catch(err => {
            reject(err);
          });
        }
      )
    }
  }
}
