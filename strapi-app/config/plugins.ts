export default ({ env }) => ({
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        baseUrl: env('STRAPI_PLUGIN_UPLOAD_PROVIDER_OPTIONS__BASE_URL'),
        s3Options: {
          endpoint: env('STRAPI_PLUGIN_UPLOAD_PROVIDER_OPTIONS__S3_OPTIONS__ENDPOINT'),
          forcePathStyle: env.bool(
            'STRAPI_PLUGIN_UPLOAD_PROVIDER_OPTIONS__S3_OPTIONS__FORCE_PATH_STYLE',
            true
          ),
          region: env('STRAPI_PLUGIN_UPLOAD_PROVIDER_OPTIONS__S3_OPTIONS__REGION', 'us-east-1'),
          signatureVersion: env(
            'STRAPI_PLUGIN_UPLOAD_PROVIDER_OPTIONS__S3_OPTIONS__SIGNATURE_VERSION',
            'v4'
          ),
          credentials: {
            accessKeyId: env('STRAPI_PLUGIN_UPLOAD_PROVIDER_OPTIONS__CREDENTIALS__ACCESS_KEY_ID'),
            secretAccessKey: env(
              'STRAPI_PLUGIN_UPLOAD_PROVIDER_OPTIONS__CREDENTIALS__SECRET_ACCESS_KEY'
            ),
          },
        },
        params: {
          Bucket: env('STRAPI_PLUGIN_UPLOAD_PROVIDER_OPTIONS__BUCKET', 'uploads'),
        },
      },
    },
  },
});
