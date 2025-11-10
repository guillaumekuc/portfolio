import { MusicPlaylistFolio } from './folios/MusicPlaylistFolio.js';
import { IllustrationFolio1 } from './folios/IllustrationFolio1.js';
import { IllustrationFolio2 } from './folios/IllustrationFolio2.js';
import { Gridz } from './folios/Gridz.js';
import { DrawingFolio1 } from './folios/DrawingFolio1.js';
import { DrawingFolio2 } from './folios/DrawingFolio2.js';
import { ModeFolio1 } from './folios/ModeFolio1.js';
import { MusicFolio1 } from './folios/MusicFolio1.js';
import { AnimFolio1 } from './folios/AnimFolio1.js';
import { P4bookFolio } from './folios/P4bookFolio.js';
import { Websites } from './folios/Websites.js';

export function Folios() {
  return /* html */ `
<div id="musicPlaylistFolio" class="fullPage folio folioMusic folioAll">
	${MusicPlaylistFolio()}
</div>

<div id="illustrationFolio1" class="fullPage folio folio2D folioAll">
	${IllustrationFolio1()}
</div>

<div id="gridzFolio" class="fullPage folio folioWeb folioAll">
	${Gridz()}
</div>

<div id="drawingFolio1" class="fullPage folio folio2D folioAll">
	${DrawingFolio1()}
</div>

<div id="modeFolio1" class="fullPage folio folioAll folio3D">
	${ModeFolio1()}
</div>

<div id="illustrationFolio2" class="fullPage folio folio2D folioAll">
	${IllustrationFolio2()}
</div>

<div id="musicVidFolio" class="fullPage folio folioMusic folioAll">
	${MusicFolio1()}
</div>

<div id="animFolio1" class="fullPage folio folio3D folioAll">
	${AnimFolio1()}
</div>

<div id="drawingFolio2" class="fullPage folio folio2D folioAll">
	${DrawingFolio2()}
</div>

<div id="P4book" class="fullPage folio folioMusic folioAll">
	${P4bookFolio()}
</div>

<div id="websitesFolio" class="fullPage folio folioWeb folioAll">
	${Websites()}
</div>
`;
}

