# Step-by-Step Testing Guide

## Prerequisites
1. Ensure the development server is running: `npm run dev`
2. Navigate to `http://localhost:5173` in your browser
3. Have admin credentials ready (default admin login should be configured)

---

## Test Scenario 1: Complete Page Creation Workflow

### Step 1: Access Admin Panel
1. Navigate to `/admin` in your browser
2. Log in with admin credentials
3. You should see the Admin Dashboard

### Step 2: Create a Main Page
1. Click on **"Pages"** in the admin sidebar
2. Click **"Add Main Page"** button
3. Enter a page name, for example: `Electrical Switches`
4. Click **"Create"**
5. **✓ Verify:** The page appears in the list immediately

### Step 3: Verify Navbar Update
1. Open the website in a new tab (or go to homepage)
2. Hover over **"Shop"** in the navbar
3. **✓ Verify:** You see "Electrical Switches" in the dropdown menu

### Step 4: Create a Subpage
1. Go back to Admin Panel → Pages
2. Click **"Add Subpage"** button
3. Select parent page: `Electrical Switches`
4. Enter subpage name: `Wall Switches`
5. Click **"Create"**
6. **✓ Verify:** The subpage appears under "Electrical Switches"

### Step 5: Verify Navbar Subpage
1. Refresh the website (or open new tab)
2. Hover over **"Shop"** in the navbar
3. Expand "Electrical Switches"
4. **✓ Verify:** You see "Wall Switches" listed under it

---

## Test Scenario 2: Complete Product Creation Workflow

### Step 1: Create a Category (if needed)
1. Go to Admin Panel → **Categories**
2. Click **"Add Category"**
3. Enter category name: `Switches`
4. Add an icon (optional)
5. Click **"Create"**

### Step 2: Create a Product
1. Go to Admin Panel → **Add Product**
2. Fill in the following fields:
   - **Product Name:** `Modular Wall Switch - 2 Gang`
   - **Description:** `High-quality 2-gang modular wall switch with sleek design`
   - **Price:** `350`
   - **Category:** Select `Switches` (or any category you created)
   - **Brand:** `Schneider Electric`
   - **Page:** Expand "Electrical Switches" → Select "Wall Switches"
   - **Image URL:** Add at least one image URL, e.g.:
     ```
     https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400
     ```
3. Click **"List Product"**
4. **✓ Verify:** Success message appears
5. **✓ Verify:** You're redirected to Admin Products page

### Step 3: Verify Product in Shop Section
1. Navigate to **Shop** page (`/shop`)
2. **✓ Verify:** Products load automatically (you see a grid of products)
3. **✓ Verify:** Your newly created product appears in the grid
4. **✓ Verify:** Product shows correct image, name, price, brand

### Step 4: Verify Product Filtering
1. On Shop page, use the **Category** filter
2. Select the category you assigned to the product (e.g., "Switches")
3. **✓ Verify:** Product appears in filtered results
4. Try the **Search** functionality
5. Search for the product name or brand
6. **✓ Verify:** Product appears in search results

### Step 5: Verify Product in Designated Page
1. Click on **Shop** in navbar (hover to see dropdown)
2. Navigate to: **Electrical Switches → Wall Switches**
3. **✓ Verify:** Page loads with products
4. **✓ Verify:** Your newly created product appears here
5. **✓ Verify:** ONLY products assigned to "Wall Switches" are shown

### Step 6: Verify Product Detail Page
1. Click on the product card
2. **✓ Verify:** Product detail page opens
3. **✓ Verify:** All product information displays correctly
4. **✓ Verify:** Add to Cart and Add to Favorites buttons work

---

## Test Scenario 3: Multiple Products Workflow

### Step 1: Create Another Subpage
1. Admin Panel → Pages → Add Subpage
2. Parent: `Electrical Switches`
3. Name: `Dimmer Switches`
4. Create it

### Step 2: Create Products for Different Pages
1. Create Product 1:
   - Name: `LED Dimmer Switch`
   - Assign to: Electrical Switches → **Dimmer Switches**
   - Fill other required fields
   
2. Create Product 2:
   - Name: `Touch Wall Switch`
   - Assign to: Electrical Switches → **Wall Switches**
   - Fill other required fields

### Step 3: Verify Product Separation
1. Navigate to: Electrical Switches → **Wall Switches**
   - **✓ Verify:** Only shows products assigned to Wall Switches
   - Should see: "Modular Wall Switch" and "Touch Wall Switch"
   - Should NOT see: "LED Dimmer Switch"

2. Navigate to: Electrical Switches → **Dimmer Switches**
   - **✓ Verify:** Only shows products assigned to Dimmer Switches
   - Should see: "LED Dimmer Switch"
   - Should NOT see: Wall Switch products

3. Navigate to: **Shop** page
   - **✓ Verify:** Shows ALL products from all pages
   - Should see all 3 products

---

## Test Scenario 4: Real-Time Updates

### Test A: Page Creation Real-Time
1. Open the website homepage in **Browser Tab 1**
2. Open Admin Panel in **Browser Tab 2**
3. In Tab 2: Create a new Main Page: `Lighting Solutions`
4. In Tab 1: **DO NOT REFRESH** - Hover over Shop in navbar
5. **✓ Verify:** New page appears without page refresh (due to React state)

### Test B: Product Creation Real-Time
1. Open Shop page in **Browser Tab 1**
2. Open Admin Panel → Add Product in **Browser Tab 2**
3. In Tab 2: Create a new product
4. In Tab 1: Click to navigate to another page, then back to Shop
5. **✓ Verify:** New product appears

---

## Test Scenario 5: Edge Cases

### Test A: Empty Page
1. Create a new subpage without any products
2. Navigate to that page
3. **✓ Verify:** Shows "No Products Available" message
4. **✓ Verify:** Page doesn't crash or show errors

### Test B: Product Without Page
1. Try to create a product without selecting a page
2. **✓ Verify:** Form validation prevents submission
3. **✓ Verify:** Error message shows "Please select a page"

### Test C: Long Product Names
1. Create a product with a very long name (100+ characters)
2. **✓ Verify:** Product card truncates text properly
3. **✓ Verify:** Full name shows on product detail page

---

## Common Issues and Solutions

### Issue: "Products not loading"
**Solution:** 
- Check browser console for errors
- Verify Supabase connection in `src/lib/db.ts`
- Check that `/api/products` endpoint is working

### Issue: "Pages not showing in navbar"
**Solution:**
- Hard refresh the page (Ctrl+Shift+R / Cmd+Shift+R)
- Check browser console for errors
- Verify `/api/boot` endpoint is working

### Issue: "Product not appearing in designated page"
**Solution:**
- Verify the product has correct `page_id` assigned
- Check database to ensure product saved correctly
- Navigate away and back to the page to trigger refetch

---

## Success Criteria

All tests pass if:
- ✅ New pages appear in navbar immediately after creation
- ✅ Products load automatically in Shop section
- ✅ Products appear in their designated pages only
- ✅ Product filtering and search work correctly
- ✅ No console errors or crashes
- ✅ Navigation is smooth and intuitive
- ✅ All CRUD operations work as expected

---

## Next Steps After Testing

If all tests pass:
1. ✅ Mark the feature as complete
2. ✅ Deploy to production (if ready)
3. ✅ Monitor for any user-reported issues

If tests fail:
1. Document the specific failure
2. Check browser console for errors
3. Verify database connections
4. Review the FIXES_APPLIED_SUMMARY.md for technical details




