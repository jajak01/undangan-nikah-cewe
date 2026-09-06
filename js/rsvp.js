/**
 * RSVP & WISHES MANAGER
 * Handles guest confirmations, wish submissions, counter calculations, and Supabase integration.
 *
 * Guest flow:
 *   1. Guest name is pre-registered in Supabase `guests` (with a unique `slug`).
 *   2. Guest opens their personal link, e.g. `/keluarga-besar-dawam`.
 *   3. We look the guest up by slug and show their name on the cover + hero + form.
 *   4. The guest only picks "Konfirmasi Kehadiran" and writes "Ucapan & Doa Restu"
 *      (no name / WhatsApp / pax input) — the existing row is UPDATED, not inserted.
 */

import { WEDDING_CONFIG } from './config.js';
import { Utils } from './utils.js';

// Default mock/seed data if offline or before Supabase is connected
const SEED_WISHES = [
  {
    id: "seed-1",
    nama_tamu: "Bpk. M. Dawam & Keluarga",
    status_kehadiran: "hadir",
    jumlah_pax: 2,
    ucapan: "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khoir. Selamat menempuh hidup baru. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.",
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    id: "seed-2",
    nama_tamu: "Keluarga Besar Kediri",
    status_kehadiran: "hadir",
    jumlah_pax: 4,
    ucapan: "Selamat berbahagia! Semoga acaranya lancar sampai hari H, dan senantiasa diberkahi kebahagiaan serta rezeki yang melimpah. Aamiin ya Rabbal 'Alamin.",
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: "seed-3",
    nama_tamu: "Sahabat & Rekan",
    status_kehadiran: "hadir",
    jumlah_pax: 1,
    ucapan: "Happy wedding! Akhirnya berlabuh ke pelaminan setelah perjalanan panjang. Semoga langgeng selalu sampai kakek nenek!",
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 3).toISOString()
  }
];

class RSVPManager {
  constructor() {
    this.wishes = [];
    this.storageKey = 'wedding_wishes_habib_adiba';
    this.currentGuest = null;
    this.slug = '';
    this.form = null;
    this.wishesListEl = null;
    this.countHadirEl = null;
    this.countTidakHadirEl = null;
    this.countRaguEl = null;
    this.totalWishesEl = null;
    this.bannerEl = null;
    this.notFoundEl = null;
  }

  async init() {
    this.form = document.getElementById('rsvp-form');
    this.wishesListEl = document.getElementById('wishes-list');
    this.countHadirEl = document.getElementById('count-hadir');
    this.countTidakHadirEl = document.getElementById('count-tidak-hadir');
    this.countRaguEl = document.getElementById('count-ragu');
    this.totalWishesEl = document.getElementById('total-wishes-count');
    this.bannerEl = document.getElementById('rsvp-guest-banner');
    this.notFoundEl = document.getElementById('rsvp-not-found');

    this.slug = Utils.getGuestSlug();

    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    if (this.isSupabaseConfigured()) {
      await this.resolveCurrentGuest();
    } else {
      this.showNotFound(
        'Database Belum Terhubung',
        'Hubungkan Supabase (isi <span class="font-mono">js/env.js</span>) agar tamu dapat melakukan konfirmasi.'
      );
    }

    await this.loadWishes();
  }

  isSupabaseConfigured() {
    return Boolean(
      WEDDING_CONFIG.supabase &&
      WEDDING_CONFIG.supabase.url &&
      WEDDING_CONFIG.supabase.anonKey &&
      WEDDING_CONFIG.supabase.url.trim().startsWith('https://') &&
      WEDDING_CONFIG.supabase.anonKey.trim().length > 20
    );
  }

  supabaseUrl() {
    return WEDDING_CONFIG.supabase.url.trim().replace(/\/+$/, '');
  }

  supabaseHeaders() {
    return {
      'apikey': WEDDING_CONFIG.supabase.anonKey.trim(),
      'Authorization': `Bearer ${WEDDING_CONFIG.supabase.anonKey.trim()}`
    };
  }

  /**
   * Look up the current guest by slug and, when found, personalize the page
   * and reveal the (simplified) RSVP form.
   */
  async resolveCurrentGuest() {
    if (!this.slug) {
      this.showNotFound();
      return;
    }

    try {
      const response = await fetch(
        `${this.supabaseUrl()}/rest/v1/guests?select=id,slug,nama_tamu,status_kehadiran,jumlah_pax,created_at,updated_at&slug=eq.${encodeURIComponent(this.slug)}&limit=1`,
        { headers: this.supabaseHeaders() }
      );

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          this.currentGuest = data[0];
          this.applyGuestToUI();
          return;
        }
      } else {
        console.warn('Guest lookup returned status:', response.status);
      }
    } catch (err) {
      console.warn('Guest lookup failed:', err);
    }

    this.showNotFound();
  }

  applyGuestToUI() {
    const guest = this.currentGuest;
    if (!guest) return;

    const coverEl = document.getElementById('guest-name-cover');
    if (coverEl) coverEl.textContent = guest.nama_tamu;

    const heroEl = document.getElementById('guest-name-hero');
    if (heroEl) heroEl.textContent = `Spesial untuk: ${guest.nama_tamu}`;

    if (this.bannerEl) {
      this.bannerEl.textContent = `Konfirmasi kehadiran untuk: ${guest.nama_tamu}`;
    }

    if (this.form) this.form.classList.remove('hidden');
    if (this.notFoundEl) this.notFoundEl.classList.add('hidden');
  }

  showNotFound(title, message) {
    if (this.form) this.form.classList.add('hidden');
    if (!this.notFoundEl) return;

    this.notFoundEl.classList.remove('hidden');

    const titleEl = this.notFoundEl.querySelector('.rsvp-not-found-title');
    const textEl = this.notFoundEl.querySelector('.rsvp-not-found-text');

    if (titleEl) titleEl.textContent = title || 'Tautan Undangan Tidak Ditemukan';
    if (textEl) {
      textEl.innerHTML = message ||
        'Silakan buka tautan undangan pribadi Anda (mis. <span class="font-mono">/nama-tamu</span>) untuk melakukan konfirmasi.';
    }
  }

  async loadWishes() {
    if (this.isSupabaseConfigured()) {
      try {
        // Fetch rows ordered by updated_at.desc so recent updates appear first
        const response = await fetch(
          `${this.supabaseUrl()}/rest/v1/guests?select=id,nama_tamu,status_kehadiran,jumlah_pax,ucapan,created_at,updated_at&ucapan=not.is.null&order=updated_at.desc`,
          { headers: this.supabaseHeaders() }
        );
        if (response.ok) {
          const data = await response.json();
          this.wishes = Array.isArray(data) ? data : [];
        } else {
          console.warn('Supabase fetch returned status:', response.status);
          this.loadLocalWishes();
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local storage:', err);
        this.loadLocalWishes();
      }
    } else {
      this.loadLocalWishes();
    }

    this.render();
  }

  loadLocalWishes() {
    const localData = localStorage.getItem(this.storageKey);
    if (localData) {
      try {
        this.wishes = JSON.parse(localData);
      } catch (e) {
        this.wishes = SEED_WISHES;
      }
    } else {
      this.wishes = SEED_WISHES;
      localStorage.setItem(this.storageKey, JSON.stringify(this.wishes));
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.currentGuest) {
      Utils.showToast('Tautan undangan tidak terdeteksi. Silakan gunakan tautan pribadi Anda.', 'error');
      return;
    }

    const btnSubmit = document.getElementById('btn-rsvp-submit');
    const originalText = btnSubmit ? btnSubmit.innerHTML : 'Kirim Ucapan &amp; Konfirmasi';

    const statusEl = document.querySelector('input[name="kehadiran"]:checked');
    const status = statusEl ? statusEl.value : 'hadir';
    const ucapan = document.getElementById('rsvp-message')?.value.trim();

    if (!ucapan) {
      Utils.showToast('Mohon tuliskan ucapan & doa restu', 'error');
      return;
    }

    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> Menyimpan...
      `;
    }

    const nowIso = new Date().toISOString();
    const payload = {
      status_kehadiran: status,
      ucapan: ucapan
    };

    let success = false;

    if (this.isSupabaseConfigured()) {
      try {
        const response = await fetch(
          `${this.supabaseUrl()}/rest/v1/guests?id=eq.${encodeURIComponent(this.currentGuest.id)}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': WEDDING_CONFIG.supabase.anonKey.trim(),
              'Authorization': `Bearer ${WEDDING_CONFIG.supabase.anonKey.trim()}`,
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(payload)
          }
        );

        if (response.ok) {
          const updated = await response.json();
          const row = (Array.isArray(updated) && updated[0]) || {
            ...this.currentGuest,
            ...payload,
            updated_at: nowIso
          };
          this.upsertLocalWish(row);
          success = true;
        } else {
          const errBody = await response.text();
          throw new Error(`Supabase update error: ${response.status} ${errBody}`);
        }
      } catch (err) {
        console.warn('Supabase update error, saving locally:', err);
        this.upsertLocalWish({
          ...this.currentGuest,
          ...payload,
          updated_at: nowIso
        });
        localStorage.setItem(this.storageKey, JSON.stringify(this.wishes));
        success = true;
      }
    } else {
      // LocalStorage mode (no database)
      this.upsertLocalWish({
        ...this.currentGuest,
        ...payload,
        updated_at: nowIso
      });
      localStorage.setItem(this.storageKey, JSON.stringify(this.wishes));
      success = true;
    }

    if (btnSubmit) {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = originalText;
    }

    if (success) {
      Utils.showToast('Terima kasih! Konfirmasi dan doa restu Anda telah tersimpan.', 'success');
      const msgEl = document.getElementById('rsvp-message');
      if (msgEl) msgEl.value = '';
      this.render();

      if (this.wishesListEl) {
        this.wishesListEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }

  upsertLocalWish(row) {
    if (!row || !row.id) return;
    const idx = this.wishes.findIndex(w => w.id === row.id);
    if (idx >= 0) {
      this.wishes[idx] = { ...this.wishes[idx], ...row };
    } else {
      this.wishes.unshift(row);
    }

    // Keep wishes array sorted by updated_at (newest first) locally
    this.wishes.sort((a, b) => {
      const timeA = new Date(a.updated_at || a.created_at || 0).getTime();
      const timeB = new Date(b.updated_at || b.created_at || 0).getTime();
      return timeB - timeA;
    });
  }

  render() {
    this.updateCounters();
    this.renderWishesList();
  }

  updateCounters() {
    let hadir = 0;
    let tidakHadir = 0;
    let ragu = 0;

    this.wishes.forEach(item => {
      if (item.status_kehadiran === 'hadir') hadir += (item.jumlah_pax || 1);
      else if (item.status_kehadiran === 'tidak_hadir') tidakHadir += 1;
      else ragu += 1;
    });

    if (this.countHadirEl) this.countHadirEl.textContent = hadir;
    if (this.countTidakHadirEl) this.countTidakHadirEl.textContent = tidakHadir;
    if (this.countRaguEl) this.countRaguEl.textContent = ragu;
    if (this.totalWishesEl) this.totalWishesEl.textContent = `${this.wishes.length} Ucapan`;
  }

  renderWishesList() {
    if (!this.wishesListEl) return;

    if (this.wishes.length === 0) {
      this.wishesListEl.innerHTML = `
        <div class="text-center py-8 text-[#766960]">
          <p>Belum ada ucapan. Jadilah yang pertama memberikan doa restu!</p>
        </div>
      `;
      return;
    }

    const html = this.wishes.map(wish => {
      const isHadir = wish.status_kehadiran === 'hadir';
      const isTidak = wish.status_kehadiran === 'tidak_hadir';

      let badgeClass = 'bg-[#4A2E2B]/10 text-[#4A2E2B] border border-[#D9A05B]/40';
      let badgeText = 'Akan Hadir';
      let iconSvg = `<svg class="w-3 h-3 mr-1 text-[#D9A05B]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>`;

      if (isTidak) {
        badgeClass = 'bg-[#8B263E]/10 text-[#8B263E] border border-[#8B263E]/30';
        badgeText = 'Berhalangan Hadir';
        iconSvg = `<svg class="w-3 h-3 mr-1 text-[#8B263E]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>`;
      } else if (!isHadir && !isTidak) {
        badgeClass = 'bg-[#766960]/10 text-[#766960] border border-[#766960]/30';
        badgeText = 'Masih Ragu';
        iconSvg = `<svg class="w-3 h-3 mr-1 text-[#766960]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 10-1-1zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>`;
      }

      const initial = (wish.nama_tamu || 'T').charAt(0).toUpperCase();
      // Use updated_at timestamp, fall back to created_at if undefined
      const timeStr = Utils.formatTimeAgo(wish.updated_at || wish.created_at || new Date());
      const paxText = (wish.jumlah_pax && wish.jumlah_pax > 1 && isHadir) ? ` • ${wish.jumlah_pax} Orang` : '';

      return `
        <div class="p-4 sm:p-5 rounded-2xl bg-white/90 border border-[#E4D8CA] shadow-sm transition hover:shadow-md">
          <div class="flex items-start gap-3.5">
            <div class="w-10 h-10 rounded-full bg-[#4A2E2B] text-[#D9A05B] font-serif-display font-semibold flex items-center justify-center text-sm shadow-sm flex-shrink-0 border border-[#D9A05B]">
              ${initial}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center justify-between gap-1 mb-1">
                <h4 class="font-semibold text-[#4A2E2B] text-sm sm:text-base truncate">${escapeHtml(wish.nama_tamu)}</h4>
                <span class="text-xs text-[#766960]">${timeStr}</span>
              </div>
              <div class="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full mb-2 ${badgeClass}">
                ${iconSvg}
                <span>${badgeText}${paxText}</span>
              </div>
              <p class="text-xs sm:text-sm text-[#2C221E] leading-relaxed break-words">
                ${escapeHtml(wish.ucapan)}
              </p>
            </div>
          </div>
        </div>
      `;
    }).join('');

    this.wishesListEl.innerHTML = html;
  }
}

function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

export const RSVP = new RSVPManager();