/**
 * SAGU Laptop Loan — Logbook
 * Ganti SCRIPT_URL dengan URL Web App hasil deploy Google Apps Script.
 * Lihat assets/js/apps-script-code.gs untuk kode backend-nya.
 */
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_BdwRIxwOwNxbKLIM7tzGUkjlbC-Yb5LtngR4_dENysoLTRtG6-KDp0tKYTliVB-43Q/exec';

const form = document.getElementById('logbook-form');
const submitBtn = document.getElementById('submit-btn');
const submitText = document.getElementById('submit-text');

// ---------- Page loader ----------

(() => {
  const loader = document.getElementById('page-loader');
  const shownAt = Date.now();
  const minDisplay = 600;

  const hideLoader = () => {
    const elapsed = Date.now() - shownAt;
    setTimeout(() => loader.classList.add('is-hidden'), Math.max(minDisplay - elapsed, 0));
  };

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }
})();

// ---------- Alert ----------

let alertTimer = null;

function showAlert(message, type = 'success') {
  const box = document.getElementById('alert-box');
  const icon = document.getElementById('alert-icon');
  const text = document.getElementById('alert-message');

  text.textContent = message;
  icon.textContent = type === 'success' ? '✓' : '!';
  box.classList.toggle('is-error', type === 'error');
  box.classList.add('is-visible');

  clearTimeout(alertTimer);
  alertTimer = setTimeout(() => box.classList.remove('is-visible'), 4500);
}

document.getElementById('alert-close').addEventListener('click', () => {
  document.getElementById('alert-box').classList.remove('is-visible');
  clearTimeout(alertTimer);
});

document.getElementById('alert-box').addEventListener('click', (e) => {
  if (e.target.id === 'alert-box') {
    e.currentTarget.classList.remove('is-visible');
    clearTimeout(alertTimer);
  }
});

// ---------- Helpers ----------

function isConfigured() {
  return SCRIPT_URL && SCRIPT_URL.startsWith('http');
}

// ---------- Validation ----------

const requiredFields = ['nama', 'noHp', 'email', 'laptopNo', 'tanggal', 'jam', 'keperluan'];

function setFieldValid(field) {
  field.classList.remove('is-invalid');
  document.getElementById(`error-${field.id}`)?.classList.remove('is-visible');
}

function setFieldInvalid(field) {
  field.classList.add('is-invalid');
  document.getElementById(`error-${field.id}`)?.classList.add('is-visible');
}

requiredFields.forEach((name) => {
  const field = form.elements[name];
  field.addEventListener('input', () => {
    if (field.checkValidity()) setFieldValid(field);
  });
});

function validateForm() {
  let firstInvalid = null;

  requiredFields.forEach((name) => {
    const field = form.elements[name];
    if (field.checkValidity()) {
      setFieldValid(field);
    } else {
      setFieldInvalid(field);
      if (!firstInvalid) firstInvalid = field;
    }
  });

  return firstInvalid;
}

// ---------- Submit ----------

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const firstInvalid = validateForm();
  if (firstInvalid) {
    showAlert('Mohon lengkapi bidang yang wajib diisi.', 'error');
    firstInvalid.focus();
    return;
  }

  if (!isConfigured()) {
    showAlert('Google Apps Script belum terhubung. Atur SCRIPT_URL di assets/js/script.js.', 'error');
    return;
  }

  const perlengkapan = Array.from(form.querySelectorAll('input[name="perlengkapan"]:checked'))
    .map((el) => el.value);

  const data = {
    nama: form.nama.value.trim(),
    noHp: form.noHp.value.trim(),
    email: form.email.value.trim(),
    laptopNo: form.laptopNo.value,
    tanggal: form.tanggal.value,
    jam: form.jam.value,
    perlengkapan: perlengkapan.join(', '),
    status: form.status.value,
    keperluan: form.keperluan.value.trim(),
    keteranganLain: form.keteranganLain.value.trim()
  };

  submitBtn.disabled = true;
  submitText.textContent = 'Menyimpan...';

  try {
    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const result = await res.json();

    if (result.result === 'success') {
      showAlert('Catatan berhasil disimpan.', 'success');
      form.reset();
      requiredFields.forEach((name) => setFieldValid(form.elements[name]));
    } else {
      throw new Error(result.message || 'Gagal menyimpan data.');
    }
  } catch (err) {
    showAlert('Terjadi kesalahan saat menyimpan data. Coba lagi.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitText.textContent = 'Simpan Catatan';
  }
});
