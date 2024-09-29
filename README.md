## `serverless-apt-mirror`

This is an apt server built on Cloudflare's serverless stack (Workers + R2 + Cache).

It was created to reduce the load on the origin apt servers. Content is served from the edge cache whenever possible.
It returns the hit items in the order of Cloudflare Cache -> Cloudflare R2 -> Origin Server.

It was inspired by <https://github.com/cloudflare/serverless-registry>

> [!WARNING]
> This server is an experimental implementation. Do not use it for daily use or in production environments.
