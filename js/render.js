/**
 * DYNAMIC DOM RENDERER
 * Automatically populates ALL data from config.js into index.html
 * No need to edit index.html manually when changing wedding data!
 */

import { WEDDING_CONFIG } from './config.js';
import { Utils } from './utils.js';

export function renderAllFromConfig() {
  const { couple, event, story, multimedia, gift } = WEDDING_CONFIG;
  const guestInfo = Utils.getGuestInfo();

  // 1. Page Title & Meta Tags
  document.title = `The Wedding of ${couple.groom.shortName} & ${couple.bride.shortName} — ${event.dateFormatted}`;
  
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = `The Wedding of ${couple.groom.shortName} & ${couple.bride.shortName}`;
  
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage && couple.coverPhoto) ogImage.content = couple.coverPhoto;

  // 2. Cover Section
  const coverImg = document.getElementById('cover-photo-img');
  if (coverImg && couple.coverPhoto) coverImg.src = couple.coverPhoto;

  const coverCoupleNames = document.getElementById('cover-couple-names');
  if (coverCoupleNames) {
    coverCoupleNames.innerHTML = `${couple.groom.shortName} <span class="font-sans text-2xl sm:text-4xl text-white font-light">&amp;</span> ${couple.bride.shortName}`;
  }

  const coverEventDate = document.getElementById('cover-event-date');
  if (coverEventDate) coverEventDate.textContent = event.dateFormatted;

  const guestNameCover = document.getElementById('guest-name-cover');
  if (guestNameCover) guestNameCover.textContent = guestInfo.name;

  // 3. Hero Section
  const heroCoupleNames = document.getElementById('hero-couple-names');
  if (heroCoupleNames) {
    heroCoupleNames.innerHTML = `${couple.groom.shortName} <span class="font-sans text-3xl sm:text-5xl text-accent-maroon font-light">&amp;</span> ${couple.bride.shortName}`;
  }

  const heroPhotoImg = document.getElementById('hero-photo-img');
  if (heroPhotoImg) {
    heroPhotoImg.src = couple.jointPhoto || couple.coverPhoto;
    heroPhotoImg.alt = `${couple.groom.shortName} & ${couple.bride.shortName}`;
  }

  const heroDatePin = document.getElementById('hero-date-pin');
  if (heroDatePin) {
    // Format e.g. "28.12.2026" from dateFormatted or targetTimestamp
    const d = new Date(event.targetTimestamp);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      heroDatePin.textContent = `${day}.${month}.${year}`;
    } else {
      heroDatePin.textContent = event.dateFormatted;
    }
  }

  const guestNameHero = document.getElementById('guest-name-hero');
  if (guestNameHero && guestInfo.isCustom) {
    guestNameHero.textContent = `Spesial untuk: ${guestInfo.name}`;
  }

  // 4. Couple Section
  // Groom
  const groomPhoto = document.getElementById('groom-photo');
  if (groomPhoto && couple.groom.photo) groomPhoto.src = couple.groom.photo;

  const groomName = document.getElementById('groom-full-name');
  if (groomName) groomName.textContent = couple.groom.fullName;

  const groomParents = document.getElementById('groom-parents-info');
  if (groomParents) {
    groomParents.innerHTML = `
      ${couple.groom.childOrder || 'Putra'} dari Pasangan<br />
      <strong class="text-text-main">${couple.groom.father}</strong> &amp; <strong class="text-text-main">${couple.groom.mother}</strong>
    `;
  }

  const groomAddress = document.getElementById('groom-address');
  const groomAddressText = document.getElementById('groom-address-text');
  if (groomAddressText && couple.groom.address) groomAddressText.textContent = couple.groom.address;
  if (groomAddress && !couple.groom.address) groomAddress.remove();

  const groomIg = document.getElementById('groom-instagram');
  const groomIgHandle = document.getElementById('groom-ig-handle');
  if (groomIg && couple.groom.instagram) groomIg.href = couple.groom.instagram;
  if (groomIgHandle) groomIgHandle.textContent = couple.groom.instagramHandle || '@' + couple.groom.shortName.toLowerCase();

  // Bride
  const bridePhoto = document.getElementById('bride-photo');
  if (bridePhoto && couple.bride.photo) bridePhoto.src = couple.bride.photo;

  const brideName = document.getElementById('bride-full-name');
  if (brideName) brideName.textContent = couple.bride.fullName;

  const brideParents = document.getElementById('bride-parents-info');
  if (brideParents) {
    brideParents.innerHTML = `
      ${couple.bride.childOrder || 'Putri'} dari Pasangan<br />
      <strong class="text-text-main">${couple.bride.father}</strong> &amp; <strong class="text-text-main">${couple.bride.mother}</strong>
    `;
  }

  const brideAddress = document.getElementById('bride-address');
  const brideAddressText = document.getElementById('bride-address-text');
  if (brideAddressText && couple.bride.address) brideAddressText.textContent = couple.bride.address;
  if (brideAddress && !couple.bride.address) brideAddress.remove();

  const brideIg = document.getElementById('bride-instagram');
  const brideIgHandle = document.getElementById('bride-ig-handle');
  if (brideIg && couple.bride.instagram) brideIg.href = couple.bride.instagram;
  if (brideIgHandle) brideIgHandle.textContent = couple.bride.instagramHandle || '@' + couple.bride.shortName.toLowerCase();

  // 5. Love Story Timeline (Dynamic Render)
  renderStoryTimeline(story);

  // 6. Event Details (Akad, Resepsi, Streaming)
  renderEventDetails(event, couple);

  // 7. Multimedia (YouTube Video & Photo Gallery Dynamic Render)
  renderMultimedia(multimedia);

  // 8. Digital Envelope & Gift
  renderGiftDetails(gift);

  // 9. Closing Section
  const closingPhoto = document.getElementById('closing-photo');
  if (closingPhoto) closingPhoto.src = couple.jointPhoto || couple.coverPhoto;

  const closingNames = document.getElementById('closing-couple-names');
  if (closingNames) closingNames.innerHTML = `${couple.groom.shortName} &amp; ${couple.bride.shortName}`;

  // 10. Footer
  const footerTitle = document.getElementById('footer-wedding-title');
  if (footerTitle) footerTitle.textContent = `The Wedding of ${couple.groom.shortName} & ${couple.bride.shortName}`;

  const audioTitle = document.getElementById('audio-track-title');
  if (audioTitle && multimedia.songTitle) audioTitle.textContent = multimedia.songTitle;
}

/**
 * Render Love Story Timeline from Array
 */
function renderStoryTimeline(stories) {
  const container = document.getElementById('story-timeline-container');
  if (!container || !Array.isArray(stories)) return;

  const html = stories.map((item, index) => {
    const isEven = index % 2 === 0;
    const badgeColor = isEven ? 'bg-primary/10 text-primary' : 'bg-accent-maroon/10 text-accent-maroon';
    const dotColor = isEven ? 'bg-primary' : 'bg-accent-maroon';

    return `
      <div class="relative flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center mb-12" data-aos="fade-up">
        <div class="w-full md:w-1/2 ${isEven ? 'md:pr-10 md:text-right' : 'md:pl-10 md:text-left'} text-left pl-12 md:pl-0">
          <div class="bg-white p-5 rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition">
            <span class="inline-block px-3 py-0.5 rounded-full ${badgeColor} font-semibold font-bold text-xs mb-2">${item.year}</span>
            <h3 class="font-semibold font-bold text-base text-primary mb-1">${item.title}</h3>
            <p class="text-xs sm:text-sm text-text-muted leading-relaxed">
              ${item.description}
            </p>
          </div>
        </div>
        <!-- Dot Icon -->
        <div class="absolute left-3 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full ${dotColor} border-2 border-accent-gold text-accent-gold flex items-center justify-center shadow-md">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        </div>
        <div class="hidden md:block w-1/2 ${isEven ? 'md:pl-10' : 'md:pr-10'}"></div>
      </div>
    `;
  }).join('');

  container.innerHTML = `<div class="timeline-stem"></div>${html}`;
}

/**
 * Render Event Details (Akad, Resepsi, Live Streaming)
 */
function renderEventDetails(event, couple) {
  // Live Streaming
  const streamDate = document.getElementById('stream-date');
  const streamTime = document.getElementById('stream-time');
  const streamLink = document.getElementById('stream-link');
  const streamBtnText = document.getElementById('stream-btn-text');

  if (streamDate) streamDate.textContent = event.dateFormatted;
  if (streamTime) streamTime.textContent = `Pukul: ${event.streaming?.time || '08:00 WIB'}`;
  if (streamLink && event.streaming) {
    streamLink.href = event.streaming.instagramUrl || event.streaming.youtubeUrl || '#';
  }
  if (streamBtnText) {
    streamBtnText.textContent = `Tonton Live (${couple.groom.instagramHandle || '@' + couple.groom.shortName.toLowerCase()})`;
  }

  // Akad Nikah
  const akadDate = document.getElementById('akad-date');
  const akadTime = document.getElementById('akad-time');
  const akadVenue = document.getElementById('akad-venue');
  const akadAddress = document.getElementById('akad-address');
  const akadMaps = document.getElementById('akad-maps-link');

  if (akadDate) akadDate.textContent = event.akad?.date || event.dateFormatted;
  if (akadTime) akadTime.textContent = `Pukul: ${event.akad?.time || '08:00 WIB'}`;
  if (akadVenue) akadVenue.textContent = event.akad?.venue || 'KEDIAMAN MEMPELAI WANITA';
  if (akadAddress) akadAddress.textContent = event.akad?.address || '';
  if (akadMaps && event.akad?.mapsUrl) akadMaps.href = event.akad.mapsUrl;

  // Resepsi
  const resepsiDate = document.getElementById('resepsi-date');
  const resepsiTime = document.getElementById('resepsi-time');
  const resepsiVenue = document.getElementById('resepsi-venue');
  const resepsiAddress = document.getElementById('resepsi-address');
  const resepsiMaps = document.getElementById('resepsi-maps-link');

  if (resepsiDate) resepsiDate.textContent = event.resepsi?.date || event.dateFormatted;
  if (resepsiTime) resepsiTime.textContent = `Pukul: ${event.resepsi?.time || '10:00 WIB - Selesai'}`;
  if (resepsiVenue) resepsiVenue.textContent = event.resepsi?.venue || 'KEDIAMAN MEMPELAI WANITA';
  if (resepsiAddress) resepsiAddress.textContent = event.resepsi?.address || '';
  if (resepsiMaps && event.resepsi?.mapsUrl) resepsiMaps.href = event.resepsi.mapsUrl;
}

/**
 * Render Multimedia (YouTube Video & Gallery Grid)
 */
function renderMultimedia(multimedia) {
  // YouTube Video Embed
  const videoIframe = document.getElementById('youtube-video-iframe');
  if (videoIframe && multimedia.youtubeVideoId) {
    videoIframe.src = `https://www.youtube-nocookie.com/embed/${multimedia.youtubeVideoId}?controls=1&rel=0&modestbranding=1`;
  }

  // Photo Gallery Grid
  const galleryGrid = document.getElementById('gallery-photos-grid');
  if (!galleryGrid || !Array.isArray(multimedia.gallery)) return;

  const html = multimedia.gallery.map((photo, index) => {
    return `
      <div class="gallery-thumb-item group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md cursor-pointer border border-border-subtle" data-index="${index}" data-aos="fade-up" data-aos-delay="${(index + 1) * 50}">
        <img src="${photo.thumb || photo.url}" alt="${photo.caption || 'Foto Galeri'}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" loading="lazy" />
        <div class="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span class="p-3 bg-white/90 rounded-full text-primary shadow">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
          </span>
        </div>
      </div>
    `;
  }).join('');

  galleryGrid.innerHTML = html;
}

/**
 * Render Digital Envelope & Gift Details
 */
function renderGiftDetails(gift) {
  // Bank Groom
  const bankNameGroom = document.getElementById('bank-groom-name');
  const bankAccGroom = document.getElementById('bank-groom-acc');
  const bankHolderGroom = document.getElementById('bank-groom-holder');

  if (bankNameGroom) bankNameGroom.textContent = gift.bank?.bankName || 'BANK BCA';
  if (bankAccGroom) bankAccGroom.textContent = gift.bank?.accountNumber || '';
  if (bankHolderGroom) bankHolderGroom.textContent = `a.n. ${gift.bank?.accountHolder || ''}`;

  // Bank Bride
  const bankNameBride = document.getElementById('bank-bride-name');
  const bankAccBride = document.getElementById('bank-bride-acc');
  const bankHolderBride = document.getElementById('bank-bride-holder');

  if (bankNameBride) bankNameBride.textContent = gift.bankBride?.bankName || 'MANDIRI';
  if (bankAccBride) bankAccBride.textContent = gift.bankBride?.accountNumber || '';
  if (bankHolderBride) bankHolderBride.textContent = `a.n. ${gift.bankBride?.accountHolder || ''}`;

  // Physical Gift
  const giftRecipientInfo = document.getElementById('gift-recipient-info');
  const giftAddressText = document.getElementById('gift-address-text');

  if (giftRecipientInfo) {
    giftRecipientInfo.textContent = `Penerima: ${gift.physicalGift?.recipient || ''} (${gift.physicalGift?.phone || ''})`;
  }
  if (giftAddressText) {
    giftAddressText.textContent = gift.physicalGift?.address || '';
  }
}
