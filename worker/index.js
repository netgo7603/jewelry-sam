/**
 * Cloudflare Worker API for Jewelry SAM Blog & R2 Image Storage
 * 
 * Features:
 * 1. Cloudflare R2 Image Upload (POST /api/upload)
 * 2. Cloudflare D1/KV Database CRUD for Posts (GET, POST, PUT, DELETE /api/posts)
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "*";

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Content-Type": "application/json; charset=utf-8",
    };

    // Route static assets (index.html, admin.html, images, CSS, etc.)
    if (env.ASSETS && !url.pathname.startsWith("/api/")) {
      return await env.ASSETS.fetch(request);
    }

    try {
      // Route 1: Image Upload to Cloudflare R2 (POST /api/upload)
      if (url.pathname === "/api/upload" && request.method === "POST") {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file || typeof file === "string") {
          return new Response(JSON.stringify({ error: "No file provided" }), {
            status: 400,
            headers: corsHeaders,
          });
        }

        const ext = file.name.split(".").pop() || "png";
        const filename = `jewelry_sam_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

        // Upload to R2 Bucket
        if (env.SAM_R2_BUCKET) {
          await env.SAM_R2_BUCKET.put(filename, file.stream(), {
            httpMetadata: { contentType: file.type || "image/png" },
          });
        }

        // Public R2 Domain or Fallback URL
        const r2PublicDomain = env.R2_PUBLIC_DOMAIN || "https://documind-backend.lymin80.workers.dev/r2";
        const imageUrl = `${r2PublicDomain}/${filename}`;

        return new Response(
          JSON.stringify({ success: true, url: imageUrl, filename }),
          { headers: corsHeaders }
        );
      }

      // Route 2: Get R2 Image File (GET /r2/:filename)
      if (url.pathname.startsWith("/r2/") && request.method === "GET") {
        const filename = url.pathname.replace("/r2/", "");
        if (env.SAM_R2_BUCKET) {
          const object = await env.SAM_R2_BUCKET.get(filename);
          if (object) {
            const headers = new Headers();
            object.writeHttpMetadata(headers);
            headers.set("Access-Control-Allow-Origin", "*");
            return new Response(object.body, { headers });
          }
        }
        return new Response("File not found", { status: 404 });
      }

      // Route 3: GET Posts List (GET /api/posts)
      if (url.pathname === "/api/posts" && request.method === "GET") {
        let posts = [];
        if (env.SAM_KV) {
          const stored = await env.SAM_KV.get("jewelry_sam_posts");
          if (stored) posts = JSON.parse(stored);
        }
        return new Response(JSON.stringify(posts), { headers: corsHeaders });
      }

      // Route 4: Save / Update Posts (POST /api/posts)
      if (url.pathname === "/api/posts" && request.method === "POST") {
        const postData = await request.json();
        let posts = [];

        if (env.SAM_KV) {
          const stored = await env.SAM_KV.get("jewelry_sam_posts");
          if (stored) posts = JSON.parse(stored);
        }

        if (postData.id) {
          const idx = posts.findIndex((p) => p.id === postData.id);
          if (idx !== -1) {
            posts[idx] = { ...posts[idx], ...postData };
          } else {
            posts.unshift(postData);
          }
        } else {
          postData.id = Date.now();
          posts.unshift(postData);
        }

        if (env.SAM_KV) {
          await env.SAM_KV.put("jewelry_sam_posts", JSON.stringify(posts));
        }

        return new Response(
          JSON.stringify({ success: true, post: postData, posts }),
          { headers: corsHeaders }
        );
      }

      // Route 5: Delete Post (DELETE /api/posts/:id)
      if (url.pathname.startsWith("/api/posts/") && request.method === "DELETE") {
        const id = parseInt(url.pathname.replace("/api/posts/", ""));
        let posts = [];

        if (env.SAM_KV) {
          const stored = await env.SAM_KV.get("jewelry_sam_posts");
          if (stored) posts = JSON.parse(stored);
          posts = posts.filter((p) => p.id !== id);
          await env.SAM_KV.put("jewelry_sam_posts", JSON.stringify(posts));
        }

        return new Response(JSON.stringify({ success: true, posts }), {
          headers: corsHeaders,
        });
      }

      return new Response(JSON.stringify({ message: "Jewelry SAM API Server" }), {
        headers: corsHeaders,
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  },
};
