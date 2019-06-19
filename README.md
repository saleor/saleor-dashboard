### Before you do anything

Run following command to install dependencies:
`npm i`

### Configuration

You'll need to set `APP_MOUNT_URI` and `API_URI` environment variables.
Example:
`APP_MOUNT_URI=/` and `API_URI=http://localhost:8000/graphql/` will mount
dashboard at `localhost:9000/` and set API URI to `http://localhost:8000/graphql/`.
This is default config if you start Saleor at port 8000. Setting `APP_MOUNT_URI`
to `/dashboard/` will mount app at `localhost:9000/dashboard/`.

### Development

Start development server by running following command:
`npm start`

### Production

Build application bundle by running following command:
`npm run build`
