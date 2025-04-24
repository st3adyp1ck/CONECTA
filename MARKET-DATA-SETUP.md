# CONECTA Market Data Setup

This document explains how to populate your CONECTA app with market data for San Cristóbal de las Casas.

## What's Included

We've created the following files to help you populate your database with market and vendor information:

1. `supabase/migrations/07_insert_market_data.sql` - SQL script to insert market data
2. `supabase/migrations/08_insert_vendor_data.sql` - SQL script to insert vendor data
3. `supabase/populate-markets.js` - JavaScript script to automate the insertion process
4. `supabase/README-market-data.md` - Detailed instructions for manual insertion

## Market Data Overview

The data includes:

- 12 markets in San Cristóbal de las Casas (both well-known and lesser-known)
- Detailed information for each market (location, description, specialties, etc.)
- Vendors for each market with appropriate categories and details
- Featured vendor "Sabio's Sours" with special highlighting

## How to Add the Market Data

You have two options to add the market data to your Supabase database:

### Option 1: Using the Supabase SQL Editor (Recommended)

Follow the instructions in `supabase/README-market-data.md`, which walks you through:

1. Logging into your Supabase dashboard
2. Running the SQL scripts in the SQL Editor
3. Verifying the data was added correctly

### Option 2: Using the Command Line Script

If you prefer to use the command line:

1. Navigate to the supabase directory:
   ```
   cd supabase
   ```

2. Install dependencies if you haven't already:
   ```
   npm install
   ```

3. Run the populate-markets script:
   ```
   npm run populate-markets
   ```

This script will:
- Connect to your Supabase database using the credentials in the script
- Execute the SQL scripts to add markets and vendors
- Verify the data was added correctly

## After Adding the Data

Once you've added the market data, you should be able to:

1. See all markets in the Market Navigator tab
2. View detailed information for each market
3. See vendors associated with each market
4. Find Sabio's Sours as a featured vendor

## Troubleshooting

If you encounter any issues:

- Check the Supabase dashboard for error messages
- Ensure your Supabase instance is running
- Verify that the markets and vendors tables exist in your database
- Check that you have the correct Supabase credentials

## Next Steps

After adding the market data, consider:

1. Adding more vendors or markets as needed
2. Updating the data with more accurate information
3. Adding images for each market and vendor
4. Enhancing the Market Navigator UI to showcase this data
