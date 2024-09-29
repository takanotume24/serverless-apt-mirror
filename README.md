## `serverless-apt-mirror`

This is an apt server built on Cloudflare's serverless stack (Workers + R2 + Cache).


### Concept

It was created to reduce the load on the origin apt servers. Content is served from the edge cache whenever possible.
It returns the hit items in the order of Cloudflare Cache -> Cloudflare R2 -> Origin Server.

It was inspired by <https://github.com/cloudflare/serverless-registry>

> [!WARNING]
> This server is an experimental implementation. Do not use it for daily use or in production environments.


### How to deploy

1. Clone this repository

	```
	$ git clone git@github.com:takanotume24/serverless-apt-mirror.git
	$ cd serverless-apt-mirror
	```

1. Setup Nodejs Environment

	```
	$ nvm install
	$ nvm use
	```

1. Edit `wrangler.toml`

	```
	$ cp wrangler.toml.example wrangler.toml
	```

	- Replace `archive.example.com` to your domain.
	- Chose origin apt server, and fill `ORIGIN_APT_SERVER = ""`.

1. Deploy to Cloudflare Workers

	```
	$ npx wrangler deploy --env production
	```

### How to use this mirror

1. Edit source list

	In Ubuntu 22.04, `archive.ubuntu,com` to your domain in `/etc/apt/source.list`.

1. Use apt server

	```
	$ sudo apt update
	Get:1 https://[your domain]/ubuntu jammy InRelease [270 kB]
	Get:2 https://[your domain]/ubuntu jammy-updates InRelease [128 kB]
	Get:3 https://[your domain]/ubuntu jammy-backports InRelease [127 kB]
	```

