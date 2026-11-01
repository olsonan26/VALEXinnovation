import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ecosystemRoutes,renderEcosystemPage} from '../content/ecosystem.mjs';
import {routes,renderPage} from '../content/pages.mjs';

test('ecosystem routes are part of the existing site build',()=>{
  assert.equal(ecosystemRoutes.length,11);
  for(const route of ecosystemRoutes){
    assert.ok(routes.includes(route),route);
    const html=renderPage(route);
    assert.equal(html,renderEcosystemPage(route),route);
    assert.equal((html.match(/<main\b/g)||[]).length,1,route);
    assert.equal((html.match(/<h1\b/g)||[]).length,1,route);
    assert.match(html,/<link rel="stylesheet" href="\/ecosystem.css">/);
    assert.match(html,/<script src="\/ecosystem.js" defer><\/script>/);
    assert.match(html,/<nav class="eco-nav"/);
    assert.match(html,/<meta name="description"/);
  }
});
test('actual software references are traceable to bundled screenshots',()=>{
  const html=renderPage('/business/demo/');
  for(const file of ['workspace.jpg','team-timeline.jpg','monthly-review.jpg','person-report.jpg']){
    assert.ok(html.includes('/assets/screenshots/'+file),file);
    assert.ok(fs.existsSync(new URL('../assets/screenshots/'+file,import.meta.url)),file);
  }
});
test('free-assessment form is staged, browser-only and does not ask for employee DOB',()=>{
  const html=renderPage('/business/free-assessment/');
  for(const step of ['1','2','3','4'])assert.ok(html.includes('data-step="'+step+'"'));
  for(const name of ['company','name','email','headcount','industry','goal','acknowledge'])assert.ok(html.includes('name="'+name+'"'),name);
  assert.ok(!html.includes('type="date"'));
  assert.ok(!html.includes('name="employee"'));
  assert.match(html,/Nothing is submitted to a server/);
  assert.match(html,/mailto:Valexinnovations@gmail.com/);
});
test('proposed pricing and credentials are not advertised as operational',()=>{
  const price=renderPage('/business/pricing/');
  assert.match(price,/not approved prices or a live checkout/);
  for(const id of ['eco-employees','eco-reports','eco-monthly-total','eco-first-total'])assert.ok(price.includes('id="'+id+'"'));
  const academy=renderPage('/academy/courses/');
  assert.equal((academy.match(/class="eco-module"/g)||[]).length,17);
  assert.match(academy,/not a claim that courses are available to purchase/);
  const unit=renderPage('/accreditation/units/');
  assert.match(unit,/Draft categories only/);
  assert.match(unit,/Proposed · not accredited/);
});
test('consultation is explicitly a mailto inquiry, not a reservation or charged booking',()=>{
  const html=renderPage('/consultation/');
  assert.match(html,/Request, not booking/);
  assert.match(html,/You must choose Send/);
  assert.ok(html.includes('id="eco-consultation"'));
});

test('certificate sample is marked as non-issued and person attribution removed',()=>{const html=renderPage('/accreditation/certificate-example/');assert.match(html,/SAMPLE · NOT ISSUED/);assert.match(html,/eco-certificate-art/);assert.match(html,/at\.adobe\.com/);assert.match(renderPage('/accreditation/'),/certificate-preview/);for(const route of ecosystemRoutes)assert.doesNotMatch(renderPage(route),/Peter(?: Vaughan)?/);});
