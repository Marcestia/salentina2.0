// Configuration statique de la bannière partagée (Supabase)
// 1) Créez une table `site_status` avec colonnes: id (int PK), message (text), color (text)
// 2) Ajoutez une ligne initiale: id=1, message='', color='closed'
// 3) Renseignez supabaseUrl + supabaseAnonKey ci-dessous
window.SALENTINA_STATUS_CONFIG = {
  supabaseUrl: "",
  supabaseAnonKey: "",
  statusRowId: 1,
  adminPassword: "pizza 2025"
};
