# CNAME Record Setup Guide for ikigain.org

## What is a CNAME Record?
A CNAME (Canonical Name) record creates an alias that points one domain to another domain. Instead of pointing directly to an IP address like an A record, it points to another domain name.

## Why Use CNAME for Root Domain (@)?
- **Problem**: Your A record @ → 34.111.179.208 isn't working due to domain forwarding conflicts
- **Solution**: CNAME @ → www.ikigain.org will make the bare domain follow the same path as www
- **Result**: Both ikigain.org and www.ikigain.org will work identically

## Step-by-Step CNAME Setup in Namecheap

### Step 1: Access DNS Management
1. Login to Namecheap account
2. Go to **Domain List**
3. Click **Manage** next to ikigain.org
4. Click **Advanced DNS** tab

### Step 2: Remove Existing A Record
1. Find the A Record with Host: **@** or **ikigain**
2. Click the **trash/delete** icon to remove it
3. **Important**: Keep the www A record (don't delete it)

### Step 3: Add CNAME Record
1. Click **+ ADD NEW RECORD**
2. Select **CNAME Record** from dropdown
3. Fill in the fields:
   - **Type**: CNAME Record
   - **Host**: `@` (this represents the bare domain)
   - **Value**: `www.ikigain.org` (with or without trailing dot)
   - **TTL**: Automatic (or 5 minutes for faster testing)
4. Click **Save Changes**

## Final DNS Configuration Should Look Like:
```
Type        Host    Value                           TTL
CNAME       @       www.ikigain.org                 Automatic
A Record    www     34.111.179.208                  Automatic
TXT Record  www     replit-verify-5c5c75db-14e0...  Automatic
```

## How CNAME Works
1. User types `ikigain.org`
2. DNS looks up CNAME record: `@ → www.ikigain.org`
3. DNS then looks up A record: `www → 34.111.179.208`
4. Browser connects to 34.111.179.208
5. Server redirects to https://www.ikigain.org

## Alternative Values to Try
If `www.ikigain.org` doesn't work, try these variations:
- `www.ikigain.org.` (with trailing dot)
- `ikigai-compass-karlisvilmanis.replit.app` (direct Replit URL)

## Important Notes
- ⚠️ **Cannot have both A and CNAME records for the same host (@)**
- ✅ You can have CNAME for @ and A record for www
- 🕐 Changes typically take 5-30 minutes to propagate
- 📧 Some email providers don't work with CNAME on root domain (but you're not using email)

## Testing After Setup
Wait 10-15 minutes, then test:
```bash
# Should now work
curl -I http://ikigain.org

# Should still work  
curl -I http://www.ikigain.org
```

## Troubleshooting
If it still doesn't work after 30 minutes:
1. **Clear your browser DNS cache**: Chrome → Settings → Privacy → Clear browsing data → Cached images
2. **Try different browsers** or incognito mode
3. **Test from mobile data** (different DNS servers)
4. **Contact Namecheap support** - they can verify domain forwarding is fully disabled

## Why This Fixes the Problem
Your current A record is being overridden by Namecheap's domain parking/forwarding system. CNAME records are processed differently and typically bypass these parking systems, allowing your custom DNS to work properly.