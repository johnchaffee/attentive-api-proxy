# proxy
 
Proxy server that receives requests at `/attn-proxy` and reroutes them to Attentive Public API server at `https://api.attentivemobile.com/v1` to circumvent CORS restrictions that prevent browsers from making API requests directly to Attentive API server.

Type `npm run dev` to run it in dev using nodemon. Server will atuomatically reboot as you make/save changes.