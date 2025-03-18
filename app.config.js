module.exports = {
  name: "lookym-rork",
  slug: "lookym-rork",
  version: "1.0.0",
  extra: {
    router: {
      origin: null
    },
    supabase: {
      url: process.env.SUPABASE_URL,
      anonKey: process.env.SUPABASE_ANON_KEY
    }
  },
  platforms: ['ios', 'android', 'web'],
  android: {
    package: 'com.lookym.app'
  }
};