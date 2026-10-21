export function openapi(origin: string) {
  const security = [{ bearerAuth: [] }];
  const parameter = (name: string, description: string, type = "string") => ({ name, in: "query", description, schema: { type } });
  const content = (schema: unknown) => ({ "application/json": { schema } });
  const result = { "200": { description: "Résultat JSON" }, "401": { description: "Clé absente, expirée ou révoquée" }, "409": { description: "Une modification concurrente nécessite de relire le post" } };
  const post = { type: "object", properties: {
    id: { type: "string" }, title: { type: "string", maxLength: 120 }, body: { type: "string", maxLength: 50000 },
    category: { type: "string", description: "Nom libre ; créé automatiquement si nécessaire. Vide pour aucune catégorie." },
    date: { type: "string", description: "AAAA-MM-JJ ou chaîne vide pour retirer la date. Aucune publication automatique sur LinkedIn." },
    media: { type: "array", items: { type: "string" }, maxItems: 10, description: "Jusqu’à 10 chemins retournés par POST /media." }, stage: { type: "string", enum: ["", "À explorer", "En cours", "Prêtes à publier"] },
    x: { type: "number" }, y: { type: "number" }, expectedVersion: { type: "integer", description: "Version lue avant modification (facultatif pour un agent)." },
  } };
  return {
    openapi: "3.0.3", info: { title: "Atelier LinkedIn", version: "1.0.0", description: "API privée pour les idées, leurs images et leur planification dans le calendrier. Les filtres createdAfter/Before utilisent la date d’ajout, date/dateFrom/dateTo utilisent la date de publication. Tous les résultats sont paginés : reprendre nextCursor jusqu’à null. Si Vercel Authentication protège le projet, joindre aussi le header x-vercel-protection-bypass configuré dans Vercel." },
    servers: [{ url: `${origin}/api/linkedin` }], security,
    components: { securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "li_..." } }, schemas: { PostInput: post } },
    paths: {
      "/posts": {
        get: { operationId: "listPosts", summary: "Lire les posts par date d’ajout ou de publication", parameters: [
          parameter("createdAfter", "Ajout depuis cet instant ISO 8601 inclus, ex. 2026-10-20T00:00:00Z"), parameter("createdBefore", "Ajout avant cet instant ISO 8601 exclu"),
          parameter("updatedAfter", "Modification après cet instant ISO 8601"), parameter("date", "Date de publication exacte AAAA-MM-JJ"),
          parameter("dateFrom", "Publication à partir de cette date incluse"), parameter("dateTo", "Publication jusqu’à cette date incluse"),
          parameter("unscheduled", "true pour les posts sans date", "boolean"), parameter("category", "Nom exact de catégorie"), parameter("order", "asc ou desc (desc par défaut)"),
          parameter("limit", "Entre 1 et 200 (100 par défaut)", "integer"), parameter("cursor", "nextCursor retourné par la page précédente ; conserver les autres filtres"),
        ], responses: { ...result, "200": { description: "Posts et curseur suivant", content: content({ type: "object", properties: { posts: { type: "array", items: { type: "object" } }, nextCursor: { type: "string", nullable: true } } }) } } },
        post: { operationId: "createPost", summary: "Ajouter une idée et éventuellement sa date de publication", requestBody: { required: true, content: content({ ...post, required: ["title"] }) }, responses: { ...result, "201": { description: "Post créé avec createdAt, updatedAt et version générés côté serveur" } } },
      },
      "/posts/{id}": {
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        get: { operationId: "getPost", summary: "Lire un post", responses: result },
        patch: { operationId: "updatePost", summary: "Modifier ou planifier un post ; envoyer date pour le calendrier", requestBody: { required: true, content: content(post) }, responses: result },
        delete: { operationId: "deletePost", summary: "Supprimer une idée", parameters: [parameter("version", "Version lue avant suppression", "integer")], responses: result },
      },
      "/categories": {
        get: { operationId: "listCategories", summary: "Lire les catégories personnalisées", responses: result },
        post: { operationId: "createCategory", summary: "Créer une catégorie persistante", requestBody: { required: true, content: content({ type: "object", required: ["name"], properties: { name: { type: "string", maxLength: 60 } } }) }, responses: { "201": { description: "Catégorie créée ou réutilisée" } } },
      },
      "/media": { post: { operationId: "uploadImage", summary: "Envoyer une image privée (3 Mo maximum, JPG/PNG/GIF/WebP)", requestBody: { required: true, content: { "multipart/form-data": { schema: { type: "object", required: ["file"], properties: { file: { type: "string", format: "binary" } } } } } }, responses: { "201": { description: "Objet {image: chemin} à associer au post" } } } },
      "/media/{filename}": { get: { operationId: "readImage", summary: "Télécharger une image privée", parameters: [{ name: "filename", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Image binaire" } } } },
    },
  };
}
