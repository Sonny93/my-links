import router from '@adonisjs/core/services/router';
const FaviconsController = () => import('#controllers/favicons_controller');

/**
 * Favicon routes
 */
router.group(() => {
  router.get('/favicon', [FaviconsController, 'index']).as('favicon');
});
