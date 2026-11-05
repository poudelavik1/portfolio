// Concrete and brickwork quantity calculators (concretecal.html).
(() => {
  const CEMENT_DENSITY = 1440; // kg/m³
  const BAG = 50;              // kg
  const CFT = 35.3147;         // ft³ per m³

  const fmt = (n, d = 2) => n.toLocaleString('en', { minimumFractionDigits: d, maximumFractionDigits: d });
  const num = (el) => parseFloat(el.value);

  const show = (form, values) => {
    Object.entries(values).forEach(([key, text]) => {
      const el = form.querySelector(`[data-out="${key}"]`);
      if (el) el.textContent = text;
    });
    form.querySelector('[data-results]').hidden = false;
  };

  const fail = (form, message) => {
    form.querySelector('[data-error]').textContent = message;
    form.querySelector('[data-results]').hidden = true;
  };

  const wire = (form, calculate) => {
    let calculated = false;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      calculated = calculate();
    });
    // After the first result, keep it in step with every change.
    form.addEventListener('input', () => { if (calculated) calculated = calculate(); });
    form.addEventListener('change', () => { if (calculated) calculated = calculate(); });
  };

  // ---- Concrete ---------------------------------------------------------------
  const concrete = document.getElementById('concrete-form');
  if (concrete) {
    const custom = concrete.querySelector('#custom-ratio');
    concrete.querySelectorAll('input[name="mix"]').forEach((r) => r.addEventListener('change', () => {
      custom.hidden = concrete.querySelector('input[name="mix"]:checked').value !== 'custom';
    }));

    wire(concrete, () => {
      concrete.querySelector('[data-error]').textContent = '';
      const volume = num(concrete.querySelector('#c-volume'));
      if (!(volume > 0)) { fail(concrete, 'Enter a concrete volume greater than zero.'); return false; }

      const mix = concrete.querySelector('input[name="mix"]:checked').value;
      const parts = mix === 'custom'
        ? [...custom.querySelectorAll('[data-part]')].map(num)
        : mix.split(':').map(Number);
      if (parts.some((p) => !(p >= 0)) || !(parts[0] > 0)) {
        fail(concrete, 'Enter a ratio with at least some cement, e.g. 1 : 2 : 4.');
        return false;
      }

      const total = parts.reduce((a, b) => a + b, 0);
      const dry = 1.54 * volume;
      const cementKg = (dry * parts[0] / total) * CEMENT_DENSITY;
      const sand = dry * parts[1] / total;
      const aggregate = dry * parts[2] / total;
      const water = cementKg * num(concrete.querySelector('#c-wc'));

      show(concrete, {
        'cement-bags': fmt(cementKg / BAG, 1),
        'cement-kg': `(${fmt(cementKg, 0)} kg)`,
        water: fmt(water, 0),
        sand: fmt(sand),
        'sand-cft': `(${fmt(sand * CFT, 1)} cft)`,
        aggregate: fmt(aggregate),
        'agg-cft': `(${fmt(aggregate * CFT, 1)} cft)`,
      });
      return true;
    });
  }

  // ---- Brickwork --------------------------------------------------------------
  const brick = document.getElementById('brick-form');
  if (brick) {
    const BRICK = 0.24 * 0.115 * 0.057;             // m³, brick alone
    const BRICK_IN_WALL = 0.25 * 0.125 * 0.067;     // m³, brick plus 10 mm joints
    const list = brick.querySelector('[data-openings]');
    const template = document.getElementById('opening-template');
    const mortar = brick.querySelector('#b-mortar');

    brick.querySelector('[data-add-opening]').addEventListener('click', () => {
      list.append(template.content.cloneNode(true));
      list.lastElementChild.querySelector('input').focus();
    });
    list.addEventListener('click', (e) => {
      const remove = e.target.closest('[data-remove]');
      if (!remove) return;
      remove.closest('.opening').remove();
      brick.dispatchEvent(new Event('change'));
    });

    // Picking a wall type sets the usual mortar for it; the user can still change it.
    brick.querySelectorAll('input[name="wall"]').forEach((r) => r.addEventListener('change', () => {
      mortar.value = r.dataset.mortar;
    }));

    wire(brick, () => {
      brick.querySelector('[data-error]').textContent = '';
      const length = num(brick.querySelector('#b-length'));
      const height = num(brick.querySelector('#b-height'));
      if (!(length > 0) || !(height > 0)) { fail(brick, 'Enter the wall length and height in metres.'); return false; }

      const openings = [...list.querySelectorAll('.opening')].reduce((sum, row) => {
        const w = num(row.querySelector('[data-dim="w"]')) || 0;
        const h = num(row.querySelector('[data-dim="h"]')) || 0;
        return sum + w * h;
      }, 0);
      const area = length * height - openings;
      if (!(area > 0)) { fail(brick, 'The openings are as big as the wall. Check the sizes.'); return false; }

      const thickness = parseFloat(brick.querySelector('input[name="wall"]:checked').value);
      const volume = area * thickness;
      const bricks = volume / BRICK_IN_WALL;
      const wetMortar = volume - bricks * BRICK;
      const dryMortar = 1.33 * wetMortar;
      const sandParts = parseFloat(mortar.value);
      const cementKg = (dryMortar / (1 + sandParts)) * CEMENT_DENSITY;
      const sand = dryMortar * sandParts / (1 + sandParts);

      show(brick, {
        bricks: Math.ceil(bricks * 1.05).toLocaleString('en'),
        'cement-bags': fmt(cementKg / BAG, 1),
        'cement-kg': `(${fmt(cementKg, 0)} kg)`,
        sand: fmt(sand),
        'sand-cft': `(${fmt(sand * CFT, 1)} cft)`,
        volume: fmt(volume),
        area: `(${fmt(area)} m² net)`,
      });
      return true;
    });
  }
})();
