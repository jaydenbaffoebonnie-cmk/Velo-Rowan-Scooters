# Velo-Rowan-Scooters

## Supabase Auth

The signup and login forms use Supabase Auth when the project credentials are configured. Add this script before `app.js` in `index.html`:

```html
<script>
	window.VELO_SUPABASE_CONFIG = {
		url: 'https://YOUR_PROJECT.supabase.co',
		anonKey: 'YOUR_SUPABASE_ANON_KEY'
	};
</script>
```

Use the public `anon` key only. Never place the Supabase service-role key in this website. In Supabase, enable Email auth and configure the site URL under Authentication settings so verification links return to the Velo app.