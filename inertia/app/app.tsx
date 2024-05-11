import { resolvePageComponent } from '@adonisjs/inertia/helpers';
import { createInertiaApp } from '@inertiajs/react';
import { hydrateRoot } from 'react-dom/client';
import { primaryColor } from '~/styles/theme';

import '../i18n/index';

const appName = import.meta.env.VITE_APP_NAME || 'MyLinks';

createInertiaApp({
  progress: { color: primaryColor },

  title: (title) => `${appName}${title && ` - ${title}`}`,

  resolve: (name) => {
    return resolvePageComponent(
      `../pages/${name}.tsx`,
      import.meta.glob('../pages/**/*.tsx')
    );
  },

  setup({ el, App, props }) {
    hydrateRoot(el, <App {...props} />);
  },
});
