# G Collection – mise en ligne

1. **GitHub** : créez un dépôt `g-collection`, puis "uploading an existing file" et glissez TOUT le contenu du dossier dézippé (api/, images/, index.html, package.json…).
2. **Vercel** (vercel.com, connexion avec GitHub) : Add New > Project > importez `g-collection` > Deploy. Le site est en ligne avec les 8 pagnes.
3. **Admin** (pour ajouter d'autres pagnes) : créez une base **Turso** (URL + token) et un compte **Cloudinary** (cloud name, API key, API secret).
   Vercel > Projet > Settings > Environment Variables, ajoutez :
   TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
   Puis Deployments > ... > **Redeploy** (obligatoire après ajout des variables).
4. Admin : https://votre-site.vercel.app/admin.html

Prix / noms / descriptions des 8 pagnes de départ : fichier `products.js`.
