import './proof.js';
import './personal-ui.js';
const example=document.getElementById('load-example'),form=document.getElementById('pair-form');
example.disabled=false;
example.addEventListener('click',()=>form.requestSubmit());
// Begin with the canonical fictional comparison; keep input optional.
example.click();
form.dataset.initialPreview='false';
