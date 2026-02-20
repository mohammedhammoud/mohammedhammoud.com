---
title: "Deploying to GitHub Pages with a Custom Domain"
description: "DNS plus GitHub Pages settings that make custom domains work, and the common causes of NotServedByPagesError."
publishedAt: 2026-02-20
draft: false
---

I deployed this site to GitHub Pages and wanted to use a custom domain. This post documents the configuration that worked.

Repo: <https://github.com/mohammedhammoud/mohammedhammoud.com>

## Checklist

To serve a custom domain from GitHub Pages, all of this must be true:

- [x] DNS matches GitHub’s documented records (<https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https#verifying-the-dns-configuration>)
- [x] GitHub Pages is enabled for the repository
- [x] A successful Pages deploy has run at least once
- [x] The custom domain is saved in GitHub so validation and TLS can start
- [x] A `CNAME` file exists in the published Pages output

If one of these is missing, you may see:

```text
NotServedByPagesError
```

## GitHub configuration

### 1. Enable Pages

Open:

1. **Settings**
2. **Pages**

Under **Build and deployment**:

1. **Source**: **GitHub Actions**

Without an active Pages deployment, GitHub cannot validate or serve your custom domain.

### 2. Save your custom domain

Still on the Pages settings page, set:

```text
Custom domain: mohammedhammoud.com
```

Save it.

After saving, GitHub should start:

- [x] DNS validation
- [x] TLS certificate provisioning

Wait for TLS provisioning, then enable **Enforce HTTPS**.

If the domain is attached to another Pages site, you must remove it there first.

## DNS configuration in your domain registrar

In your domain registrar (I use Loopia):

### 1. Remove wildcard records

Remove any wildcard `*` records.

### 2. Point `www` to GitHub Pages

Set `www` as a CNAME to your GitHub Pages host:

```text
CNAME  www  mohammedhammoud.github.io.
```

### 3. Point the apex domain to GitHub Pages

Use the A records documented by GitHub (in case they change over time):

<https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https#verifying-the-dns-configuration>

### 4. Leave mail DNS alone

If you use email on the domain, do not touch mail-related records such as MX, SPF, autodiscover, and similar.

<details>
<summary>What I actually did in my registrar</summary>

- Removed wildcard `*` A-records that pointed to a Loopia IP (so unknown subdomains no longer resolved incorrectly).
- Set the apex `@` to GitHub Pages using these A-records:

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

- Set `www` as a CNAME to:

```text
mohammedhammoud.github.io.
```

- Left mail DNS unchanged (MX/SPF/etc).

- Verified DNS externally (not just locally) with:

```bash
dig @1.1.1.1 +short A mohammedhammoud.com
dig @8.8.8.8 +short A mohammedhammoud.com
dig @1.1.1.1 +short CNAME www.mohammedhammoud.com
dig @8.8.8.8 +short CNAME www.mohammedhammoud.com
```

...and confirmed that `dig +short A test123.mohammedhammoud.com` returned empty (wildcard removed).

</details>

---

## Verify DNS globally

Run these checks against a public resolver:

```bash
dig @1.1.1.1 +short A mohammedhammoud.com
dig @1.1.1.1 +short CNAME www.mohammedhammoud.com
```

If DNS is correct but GitHub still complains, the usual causes are:

- Pages is not enabled, or not set to GitHub Actions
- The repo has not deployed a Pages site yet
- The domain is attached to a different Pages site

## Result

After DNS validation and TLS provisioning complete:

- <https://www.mohammedhammoud.com> should load your site
- GitHub Pages should allow **Enforce HTTPS**
