// Unit converter on the home page. Every unit is stored as its size in SI base units.
(() => {
  const root = document.querySelector('[data-converter]');
  if (!root) return;

  const FT2 = 0.09290304; // m² in one square foot
  const CATEGORIES = {
    length: {
      units: { mm: 1e-3, cm: 1e-2, m: 1, km: 1e3, in: 0.0254, ft: 0.3048, yd: 0.9144 },
      from: 'm', to: 'ft',
    },
    area: {
      units: {
        'mm²': 1e-6, 'cm²': 1e-4, 'm²': 1, ha: 1e4, 'in²': 0.00064516, 'ft²': FT2,
        ropani: 5476 * FT2, aana: 342.25 * FT2, bigha: 72900 * FT2, kattha: 3645 * FT2, dhur: 182.25 * FT2,
      },
      from: 'ropani', to: 'm²',
    },
    volume: {
      units: { 'cm³': 1e-6, L: 1e-3, 'm³': 1, 'in³': 1.6387064e-5, 'ft³': 0.028316846592, 'US gal': 0.003785411784 },
      from: 'm³', to: 'ft³',
    },
    force: {
      units: { N: 1, kN: 1e3, MN: 1e6, kgf: 9.80665, 'tonne-force': 9806.65, lbf: 4.4482216152605, kip: 4448.2216152605 },
      from: 'kN', to: 'kgf',
    },
    stress: {
      units: { Pa: 1, kPa: 1e3, MPa: 1e6, GPa: 1e9, 'N/mm²': 1e6, 'kgf/cm²': 98066.5, psi: 6894.757293168, ksi: 6894757.293168 },
      from: 'MPa', to: 'psi',
    },
  };

  const value = root.querySelector('#conv-value');
  const from = root.querySelector('#conv-from');
  const to = root.querySelector('#conv-to');
  const result = root.querySelector('#conv-result');
  const buttons = root.querySelectorAll('[data-category]');
  const nf = new Intl.NumberFormat('en', { maximumSignificantDigits: 6 });
  let category = 'length';

  const format = (n) => {
    const a = Math.abs(n);
    return a !== 0 && (a < 1e-4 || a >= 1e12) ? n.toExponential(4) : nf.format(n);
  };

  const fill = () => {
    const { units, from: f, to: t } = CATEGORIES[category];
    const options = Object.keys(units).map((u) => `<option value="${u}">${u}</option>`).join('');
    from.innerHTML = options;
    to.innerHTML = options;
    from.value = f;
    to.value = t;
  };

  const convert = () => {
    const v = parseFloat(value.value);
    if (!Number.isFinite(v)) {
      result.innerHTML = '<small>Result</small>Enter a number';
      return;
    }
    const { units } = CATEGORIES[category];
    const out = (v * units[from.value]) / units[to.value];
    result.innerHTML = `<small>Result</small>${format(v)} ${from.value} = <strong>${format(out)} ${to.value}</strong>`;
  };

  buttons.forEach((btn) => btn.addEventListener('click', () => {
    category = btn.dataset.category;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    fill();
    convert();
  }));

  root.querySelector('#conv-swap').addEventListener('click', () => {
    [from.value, to.value] = [to.value, from.value];
    convert();
  });

  [value, from, to].forEach((el) => el.addEventListener('input', convert));

  fill();
  convert();
})();
