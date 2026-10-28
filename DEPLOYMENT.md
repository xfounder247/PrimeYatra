# Deploying primeyatra.co.in on your VPS (via GitHub)

Assumes Ubuntu or Debian with root (or sudo) access. Replace `YOUR_VPS_IP` with your server address.

## 1. Point the domain to the VPS

At your domain registrar (or DNS provider) add:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | YOUR_VPS_IP |
| A | www | YOUR_VPS_IP |

DNS can take a few minutes to a few hours. Check with `ping primeyatra.co.in`.

## 2. Install tools on the VPS

```
ssh root@YOUR_VPS_IP
apt update
apt install -y git nginx certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
node -v      # should print v22.x
```

If other sites already run on this VPS with Nginx, skip installing Nginx and only add the new site config in step 5.

## 3. Let the VPS read your GitHub repo

```
ssh-keygen -t ed25519 -C "vps-deploy" -f ~/.ssh/primeyatra_deploy -N ""
cat ~/.ssh/primeyatra_deploy.pub
```

On GitHub open the repo, then Settings, Deploy keys, Add deploy key. Paste the key, leave write access off, save. Then:

```
printf "Host github.com\n  IdentityFile ~/.ssh/primeyatra_deploy\n  IdentitiesOnly yes\n" >> ~/.ssh/config
ssh -T git@github.com     # type yes; it should greet you
```

(If the repo is public you can skip this and clone with `https://github.com/xfounder247/PrimeYatra.git`.)

## 4. Get the code and build the site

```
cd /var/www
git clone git@github.com:xfounder247/PrimeYatra.git primeyatra
cd primeyatra
npm install --omit=dev
npm run build
ls dist          # index.html, assets/, sitemap.xml ...
```

## 5. Configure Nginx

```
cp deploy/nginx.conf /etc/nginx/sites-available/primeyatra
ln -s /etc/nginx/sites-available/primeyatra /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

Now `http://primeyatra.co.in` should show the site.

## 6. Turn on HTTPS

Only after DNS works:

```
certbot --nginx -d primeyatra.co.in -d www.primeyatra.co.in
```

Choose the option that redirects HTTP to HTTPS. Certificates renew automatically.

## 7. Check it works

- Open https://primeyatra.co.in on your phone.
- Tap the green WhatsApp button, the two call buttons and one form. WhatsApp should open with the message filled in.
- Open https://primeyatra.co.in/sitemap.xml and /robots.txt.
- Visit https://primeyatra.co.in/nothing-here to see the 404 page.

## 8. Tell Google

- Google Search Console: add the domain, then submit `https://primeyatra.co.in/sitemap.xml`.
- Google Business Profile: set the website to `https://primeyatra.co.in`.

## Updating the site later

Change files on GitHub (or push from a computer), then on the VPS:

```
cd /var/www/primeyatra
./deploy.sh
```

## Adding real photos

Put JPG, PNG or WebP files named after the destination in `public/images/destinations/`: `kashmir`, `manali`, `goa`, `kerala`, `rajasthan`, `uttarakhand`, `andaman`, `dubai`, `thailand`, `bali`, `singapore`, `maldives`, `vietnam`, `europe` (for example `goa.jpg`, ideally 1600 px wide, landscape). The build resizes them automatically. Only use photos you own or have a licence for. Until then the site shows illustrations.

## Information still needed before launch

Add these to `business.json` (anything empty is hidden) and tell me if you want wording changed:

1. **Verified business address.** Needed for the embedded Google map and the contact page. Until then the map section links to your Google Business Profile.
2. **Email address** and **business hours**.
3. **Social links** (Instagram, Facebook, YouTube) if you want them shown.
4. **Licences and registrations you actually hold**, for example your authorised money-changer licence, Western Union agent details, IATA or tourism registrations, GST number. Add only what is real. Nothing is shown unless you provide it, and the site makes no claims about authorisation.
5. **Real photographs** of destinations you have rights to (see above).
6. **Confirm the wording** about Western Union (the site says "assistance" and does not claim to be an official agent) and about forex (no claim of being an authorised dealer).
7. **Business story for About Us**: founding year, team, experience. The page currently avoids these because they were not provided.
8. **Legal review** of the Privacy Policy and Terms & Conditions by someone qualified, and your own cancellation and refund policy.
9. **Analytics** decision (none is installed, which keeps the privacy policy simple).
10. Confirm that **+91 76694 26000** is call-only or also WhatsApp. WhatsApp buttons use +91 98992 90016.

## What the site deliberately does not do

It shows no prices, no live exchange rates, no reviews or ratings and no visa guarantees, because none were provided and they would go out of date. Prices and rates are shared on request over WhatsApp.
