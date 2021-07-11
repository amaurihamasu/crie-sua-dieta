import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ImportacaoModulosProjeto } from './configuracao/importacao-modulos-projeto'

platformBrowserDynamic()
  .bootstrapModule(ImportacaoModulosProjeto)
  .catch(err => console.error(err));
