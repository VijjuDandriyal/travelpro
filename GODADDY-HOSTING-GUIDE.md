# 🚀 Complete GoDaddy Hosting Guide for TravelPro Website
### Step-by-Step — From Zero to Live Website

---

## STEP 1: Buy a Domain on GoDaddy

1. Go to **https://www.godaddy.com**
2. Search for your domain name e.g., `travelproagent.com`
3. Add to cart → Select **1 year or 2 years**
4. At checkout: **Skip extras** (privacy protection is optional but recommended at ~$10/yr)
5. Pay and complete purchase
6. You will receive an email with domain confirmation

---

## STEP 2: Buy Web Hosting on GoDaddy

1. Go to **https://www.godaddy.com/hosting/web-hosting**
2. Choose **Economy Plan** ($2.99/mo) for a new website — it supports HTML/PHP sites
3. OR choose **Deluxe Plan** ($4.99/mo) if you plan to add more features
4. Add to cart → Complete purchase
5. Wait 5–10 minutes for your hosting account to be provisioned

---

## STEP 3: Connect Domain to Hosting

1. Login to **https://account.godaddy.com**
2. Click **My Products**
3. Under **Web Hosting**, click **Manage**
4. In the hosting dashboard, click **Settings → Connected Domains**
5. Click **Connect Domain**
6. Select the domain you purchased in Step 1
7. Click **Connect** — GoDaddy does this automatically since both are in same account
8. Wait **24–48 hours** for DNS propagation (usually faster, ~1 hour)

---

## STEP 4: Upload Your Website via cPanel File Manager

### Option A – Using File Manager (Easiest)

1. In GoDaddy Hosting dashboard, click **cPanel Admin**
2. Inside cPanel, click **File Manager**
3. Open the folder: `public_html`
4. Delete any existing `index.html` (default placeholder)
5. Click **Upload** (top toolbar)
6. Upload your `index.html` file
7. Once uploaded, click **Go Back**
8. Your website is now LIVE at `http://yourdomain.com`

### Option B – Using FTP (FileZilla)

1. Download **FileZilla** from https://filezilla-project.org
2. In GoDaddy cPanel → **FTP Accounts** → Note your FTP credentials:
   - Host: `ftp.yourdomain.com`
   - Username: your cPanel username
   - Password: your cPanel password
   - Port: `21`
3. Open FileZilla → Enter credentials → Click **Quickconnect**
4. On the right panel, navigate to `public_html`
5. On left panel, find your `index.html` on your computer
6. Drag and drop `index.html` into `public_html`
7. Done! Website is live.

---

## STEP 5: Enable Free SSL Certificate (HTTPS)

1. In GoDaddy Hosting dashboard → **cPanel Admin**
2. Scroll down to **Security** section
3. Click **Let's Encrypt SSL** (or **SSL/TLS Status**)
4. Select your domain → Click **Run AutoSSL**
5. Wait 5–10 minutes
6. Your site will now load as `https://yourdomain.com` with the 🔒 padlock

---

## STEP 6: Set Up Email (Optional but Professional)

1. In cPanel → **Email Accounts**
2. Click **Create**
3. Username: `info` (creates info@yourdomain.com)
4. Set password → Click **Create Account**
5. Use **Webmail** to access at: `https://yourdomain.com/webmail`

---

## STEP 7: Configuration Files for GoDaddy Server

### .htaccess File (Place in public_html)

Create a file named `.htaccess` in `public_html` with this content:

```apache
# TravelPro .htaccess Configuration
# GoDaddy Apache Server

Options -Indexes

# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Remove .html extension from URLs
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ $1.html [L]

# Custom Error Pages
ErrorDocument 404 /404.html
ErrorDocument 500 /500.html

# Cache Static Files
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# GZIP Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>

# Security Headers
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-XSS-Protection "1; mode=block"
Header always set X-Content-Type-Options "nosniff"
```

---

### robots.txt File (Place in public_html)

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/

Sitemap: https://yourdomain.com/sitemap.xml
```

---

### File Structure in public_html

```
public_html/
├── index.html          ← Main website (uploaded in Step 4)
├── .htaccess           ← Server config (Step 7)
├── robots.txt          ← SEO config
├── css/
│   └── style.css       ← (if separated)
├── js/
│   └── main.js         ← (if separated)
├── images/
│   └── logo.png
└── 404.html            ← Custom error page
```

---

## STEP 8: Verify Everything is Working

| Check | URL | Expected |
|-------|-----|----------|
| Website loads | https://yourdomain.com | TravelPro homepage |
| HTTPS works | https://yourdomain.com | 🔒 padlock in browser |
| HTTP redirects | http://yourdomain.com | Auto-redirects to https:// |
| Mobile view | Open on phone | Responsive layout |
| 404 page | https://yourdomain.com/xyz | Custom error page |

---

## STEP 9: Go Live Checklist ✅

- [ ] Domain purchased and connected
- [ ] Hosting plan active
- [ ] index.html uploaded to public_html
- [ ] .htaccess file uploaded
- [ ] SSL certificate enabled (HTTPS)
- [ ] Website loads correctly on desktop
- [ ] Website loads correctly on mobile
- [ ] Forms tested (register, contact)
- [ ] Email account created
- [ ] Google Analytics added (optional)

---

## STEP 10: Add Google Analytics (Optional but Recommended)

1. Go to **https://analytics.google.com**
2. Create account → Add property → Enter your domain
3. Copy the **Measurement ID** (G-XXXXXXXXXX)
4. Paste this just before `</head>` in your index.html:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Website shows "Account Suspended" | Contact GoDaddy support — billing issue |
| SSL not working | In cPanel → AutoSSL → Force re-issue |
| Domain not connecting | DNS propagation can take 24–48 hours |
| File upload fails | Check file size limit in cPanel (usually 50MB) |
| .htaccess not working | In cPanel → File Manager → Show Hidden Files |

---

## 📞 GoDaddy Support

- **Phone**: 1-480-505-8877 (24/7)
- **Chat**: https://www.godaddy.com/contact-us
- **Help Center**: https://in.godaddy.com/help

---

*Guide created for TravelPro website deployment — 2025*
