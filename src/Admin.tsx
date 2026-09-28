import { FormEvent, useEffect, useState } from "react";
import { supabase, ADMIN_EMAIL } from "./supabase.js";
import { BlogPostBody } from "./BlogPostBody";
import { IconArrowLeft } from "./icons";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-+|-+$)/g, "");
}

function emptyPost() {
  return {
    title: "", slug: "", excerpt: "", content: "", featured_image: "", category: "",
    author: "Malik Muzamil", reading_time: "", status: "draft", published_at: null,
    seo_title: "", meta_description: "", focus_keyword: "", canonical_url: "",
    og_title: "", og_description: "", social_image: "", image_alt: "",
  } as any;
}

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
  }
  return (
    <div className="adminlogin">
      <form onSubmit={submit}>
        <h1>Shiftaan Admin</h1>
        <label>Email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" /></label>
        <label>Password<input type="password" required value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" /></label>
        {error && <p className="adminerror">{error}</p>}
        <button className="btn" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
      </form>
    </div>
  );
}

function AdminDashboard() {
  const [posts, setPosts] = useState<any[] | null>(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");

  async function load() {
    const { data, error } = await supabase.from("blog_posts").select("*").order("updated_at", { ascending: false });
    if (error) { setError(error.message); return; }
    setPosts(data);
  }
  useEffect(() => { load(); }, []);

  async function toggleStatus(p: any) {
    const next = p.status === "published" ? "draft" : "published";
    const patch: any = { status: next };
    if (next === "published" && !p.published_at) patch.published_at = new Date().toISOString();
    const { error } = await supabase.from("blog_posts").update(patch).eq("id", p.id);
    if (error) { alert(error.message); return; }
    load();
  }
  async function remove(p: any) {
    if (!confirm(`Delete "${p.title}"? This can't be undone.`)) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", p.id);
    if (error) { alert(error.message); return; }
    load();
  }
  async function signOut() { await supabase.auth.signOut(); }

  const filtered = (posts || []).filter(p =>
    (statusFilter === "all" || p.status === statusFilter) &&
    p.title.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="admindash">
      <header>
        <h1>Shiftaan Admin</h1>
        <div><A2 href="/admin/new">+ New post</A2><button className="btn secondary" onClick={signOut}>Sign out</button></div>
      </header>
      <div className="adminfilters">
        <input placeholder="Search posts…" value={q} onChange={e => setQ(e.target.value)} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
      {error && <p className="adminerror">{error}</p>}
      {!posts ? <p>Loading…</p> : filtered.length === 0 ? <p>No posts found.</p> : (
        <table className="admintable">
          <thead><tr><th>Title</th><th>Status</th><th>Updated</th><th /></tr></thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td><a href={`/admin/edit/${p.id}`}>{p.title || "(untitled)"}</a><br /><small>/blogs/{p.slug}</small></td>
                <td><span className={`badge ${p.status}`}>{p.status}</span></td>
                <td>{new Date(p.updated_at).toLocaleDateString("en-GB")}</td>
                <td className="adminrowactions">
                  <button className="linklike" onClick={() => toggleStatus(p)}>{p.status === "published" ? "Unpublish" : "Publish"}</button>
                  {p.status === "published" && <a className="linklike" href={`/blogs/${p.slug}`} target="_blank" rel="noreferrer">View</a>}
                  <button className="linklike danger" onClick={() => remove(p)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function A2({ href, children }: { href: string; children: any }) {
  return <a className="btn" href={href}>{children}</a>;
}

function AdminEditor({ id }: { id?: string }) {
  const [post, setPost] = useState<any>(id ? null : emptyPost());
  const [slugEdited, setSlugEdited] = useState(!!id);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from("blog_posts").select("*").eq("id", id).single().then(({ data, error }) => {
      if (error) { setError(error.message); return; }
      setPost(data);
    });
  }, [id]);

  function set(k: string, v: any) { setPost((p: any) => ({ ...p, [k]: v })); }
  function onTitleChange(v: string) {
    set("title", v);
    if (!slugEdited) set("slug", slugify(v));
  }

  async function save(publish?: boolean) {
    if (!post.title || !post.slug) { setError("Title and slug are required."); return; }
    setSaving(true); setError("");
    const patch: any = { ...post };
    delete patch.id; delete patch.created_at; delete patch.updated_at;
    if (publish !== undefined) {
      patch.status = publish ? "published" : "draft";
      if (publish && !patch.published_at) patch.published_at = new Date().toISOString();
    }
    const result = id
      ? await supabase.from("blog_posts").update(patch).eq("id", id).select().single()
      : await supabase.from("blog_posts").insert(patch).select().single();
    setSaving(false);
    if (result.error) { setError(result.error.message); return; }
    if (!id) history.replaceState(null, "", `/admin/edit/${result.data.id}`);
    setPost(result.data);
  }

  if (!post) return <div className="admindash"><p>Loading…</p></div>;

  return (
    <div className="admineditor">
      <header><h1>{id ? "Edit post" : "New post"}</h1><a className="btn secondary" href="/admin"><IconArrowLeft size={14}/> Back to posts</a></header>
      {error && <p className="adminerror">{error}</p>}
      <div className="editorgrid">
        <div className="editorfields">
          <h2>Content</h2>
          <label>Title<input value={post.title || ""} onChange={e => onTitleChange(e.target.value)} /></label>
          <label>Slug<input value={post.slug || ""} onChange={e => { setSlugEdited(true); set("slug", slugify(e.target.value)); }} /></label>
          <small>Publishes at /blogs/{post.slug || "…"}</small>
          <label>Excerpt<textarea rows={2} value={post.excerpt || ""} onChange={e => set("excerpt", e.target.value)} /></label>
          <label>Content (HTML)<textarea rows={14} value={post.content || ""} onChange={e => set("content", e.target.value)} /></label>
          <label>Featured image path<input value={post.featured_image || ""} onChange={e => set("featured_image", e.target.value)} placeholder="/assets/blog/your-image.jpg" /></label>
          <small>Upload the file to that path on your cPanel host — it isn't stored in Supabase.</small>
          {post.featured_image && <img className="editorpreviewimg" src={post.featured_image} alt="" onError={(e:any)=>{e.target.style.display="none"}} />}
          <label>Image alt text<input value={post.image_alt || ""} onChange={e => set("image_alt", e.target.value)} /></label>
          <label>Category<input value={post.category || ""} onChange={e => set("category", e.target.value)} /></label>
          <label>Author<input value={post.author || ""} onChange={e => set("author", e.target.value)} /></label>
          <label>Reading time<input value={post.reading_time || ""} onChange={e => set("reading_time", e.target.value)} placeholder="6 min" /></label>
          <h2>SEO</h2>
          <label>SEO title<input value={post.seo_title || ""} onChange={e => set("seo_title", e.target.value)} placeholder={post.title} /></label>
          <label>Meta description<textarea rows={2} value={post.meta_description || ""} onChange={e => set("meta_description", e.target.value)} placeholder={post.excerpt} /></label>
          <label>Focus keyword<input value={post.focus_keyword || ""} onChange={e => set("focus_keyword", e.target.value)} /></label>
          <label>Canonical URL<input value={post.canonical_url || ""} onChange={e => set("canonical_url", e.target.value)} placeholder={`https://shiftaan.com/blogs/${post.slug || ""}`} /></label>
          <label>OG title<input value={post.og_title || ""} onChange={e => set("og_title", e.target.value)} placeholder={post.seo_title || post.title} /></label>
          <label>OG description<textarea rows={2} value={post.og_description || ""} onChange={e => set("og_description", e.target.value)} placeholder={post.meta_description || post.excerpt} /></label>
        </div>
        <aside className="editorpreview">
          <h2>Search &amp; social preview</h2>
          <div className="serp"><b>{post.seo_title || post.title || "Untitled"}</b><span>shiftaan.com/blogs/{post.slug || "…"}</span><p>{post.meta_description || post.excerpt || "No description yet."}</p></div>
          <div className="socialcard">
            {post.featured_image && <img src={post.featured_image} alt="" />}
            <div><b>{post.og_title || post.seo_title || post.title || "Untitled"}</b><p>{post.og_description || post.meta_description || post.excerpt}</p></div>
          </div>
          <button className="btn secondary" type="button" onClick={() => setPreview(true)}>Full preview</button>
        </aside>
      </div>
      <div className="editoractions">
        <button className="btn secondary" disabled={saving} onClick={() => save(false)}>{post.status === "published" ? "Save (keep published)" : "Save draft"}</button>
        {post.status !== "published"
          ? <button className="btn" disabled={saving} onClick={() => save(true)}>Publish</button>
          : <button className="btn secondary" disabled={saving} onClick={() => save(false).then(() => set("status", "draft"))}>Unpublish</button>}
      </div>
      {preview && (
        <div className="editormodal" onClick={() => setPreview(false)}>
          <div onClick={e => e.stopPropagation()}>
            <button className="btn secondary" onClick={() => setPreview(false)}>Close preview</button>
            <BlogPostBody p={post} showShare={false} />
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminGate() {
  const [session, setSession] = useState<any>(undefined);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);
  if (session === undefined) return <div className="admindash"><p>Loading…</p></div>;
  if (!session || session.user.email !== ADMIN_EMAIL) return <AdminLogin />;
  const p = location.pathname.replace(/\/+$/, "");
  if (p === "/admin/new") return <AdminEditor />;
  if (p.startsWith("/admin/edit/")) return <AdminEditor id={p.split("/").pop()} />;
  return <AdminDashboard />;
}
