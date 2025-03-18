# Supabase Setup for LOOKYM

## 1. Create a Supabase Project

- Go to [https://supabase.com/](https://supabase.com/) and create a new project.
- Choose a name, region, and password for your project.

## 2. Database Setup

- Go to the SQL editor in your Supabase project.
- Run the SQL code from `sql/schema.sql` to create the database schema.
- Run the SQL code from `sql/functions.sql` to create the database functions and triggers.

## 3. Authentication Setup

- Go to the Authentication settings in your Supabase project.
- Enable Email/Password authentication.
- Configure the OAuth providers (e.g., Google) if needed.

## 4. Storage Setup

- Go to the Storage settings in your Supabase project.
- Create a new bucket for video uploads.
- Create a new bucket for profile images.
- Configure the storage policies for each bucket.

## 5. Environment Variables

- Add the following environment variables to your `.env` file:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 6. Initialize Supabase Client

- In `utils/supabase.ts`, make sure the Supabase client is initialized correctly with your Supabase URL and anon key.

```typescript
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import 'react-native-url-polyfill/auto';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS === 'web' ? undefined : ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});