export default {
  async fetch(request, env) {
    const res = await env.ASSETS.fetch(request);
    if (res.status !== 404) return res;
    return Response.redirect(new URL('/', request.url), 301);
  }
};
