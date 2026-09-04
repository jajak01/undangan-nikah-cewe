/**
 * WEDDING CONFIGURATION
 * Centralized settings for Wedding of Habib & Adiba
 * Supports Cloudinary CDN, YouTube Unlisted, and Supabase integration
 */

export const WEDDING_CONFIG = {
  // Couple Information
  couple: {
    groom: {
      fullName: "Edita Efendi",
      shortName: "Fendi",
      father: "Bapak Saridi",
      mother: "Ibu Surami",
      childOrder: "Putra",
      address: "Sempu 0036/009, Pringombo, Rongkop, Gunungkidul",
      instagram: "https://instagram.com/05.082bl",
      instagramHandle: "@05.082bl",
      // CDN / Placeholder Photo
      photo: "https://res.cloudinary.com/daiatjplq/image/upload/v1786884848/WhatsApp_Image_2026-08-16_at_11.37.40_AM_r6wacc.jpg"
    },
    bride: {
      fullName: "Tamara Andiliani",
      shortName: "Tamara",
      father: "Bapak Andi Wahyu Lukito",
      mother: "Ibu Sugiyarti",
      childOrder: "Putri",
      address: "Tenggang 004 No.014, Tengang, Kemedang, Tanjungsari, Gunungkidul",
      instagram: "https://instagram.com/tamaraandil_",
      instagramHandle: "@tamaraandil_",
      // CDN / Placeholder Photo
      photo: "https://res.cloudinary.com/daiatjplq/image/upload/v1786884848/WhatsApp_Image_2026-08-16_at_11.37.39_AM_klqkf8.jpg"
    },
    jointPhoto: "https://res.cloudinary.com/daiatjplq/image/upload/v1786884848/WhatsApp_Image_2026-08-16_at_11.35.22_AM_u4vgzu.jpg",
    coverPhoto: "https://res.cloudinary.com/daiatjplq/image/upload/v1786884848/WhatsApp_Image_2026-08-16_at_11.35.22_AM_u4vgzu.jpg"
  },

  // Event Schedule & Locations
  event: {
// Timestamp ISO & target = Acara IJAB QOBUL (Kamis, 17 September 2026 10:00 WIB / UTC+7)
    targetTimestamp: 1789606800000, // 2026-09-17T10:00:00+07:00 (Ijab Qobul)
    dateFormatted: "Kamis, 17 September 2026",
    day: "kamis",
    dateNumber: "17",
    monthYear: "September 2026",

    // Akad Nikah
    akad: {
      title: "Akad Nikah",
      date: "Kamis, 17 September 2026",
      time: "08:00 WIB - Selesai",
      venue: "KEDIAMAN MEMPELAI PRIA",
      address: "Sempu 0036/009, Pringombo Rongkop, Gunungkidul",
      mapsUrl: "https://maps.app.goo.gl/kpxCwSS1NaSogin46",
      calendarTitle: "Ijab Fendi & Tamara"
    },

    // Resepsi
    resepsi: {
      title: "Resepsi Pernikahan",
      date: "Kamis, 17 September 2026",
      time: "08:00 WIB - Selesai",
      venue: "KEDIAMAN MEMPELAI WANITA",
      address: "Tenggang 004 No.014, Tengang, Kemedang, Tanjungsari, Gunungkidul",
      mapsUrl: "https://maps.app.goo.gl/aKogD7BGKfrxEu3Z7",
      calendarTitle: "Ijab Fendi & Tamara"
    },

    // Live Streaming
    streaming: {
      time: "08:00 WIB",
      platform: "Instagram & YouTube Live",
      instagramUrl: "https://instagram.com/habib",
      youtubeUrl: "https://youtube.com"
    }
  },

  // Love Story Timeline
  story: [
    {
      year: "2022",
      title: "Awal Cerita",
      description: "Pertemuan kami dimulai dari acara Buka Bersama yang dibuat teman-teman pada Ramadhan tahun 2022. Tidak ada yang menyangka, percakapan ringan di dunia maya itu membawa kami bertemu secara langsung tepatnya di Desember 2022. Sejak saat itu, kami tidak pernah berhenti saling mengenal. Dari berteman, menjadi sahabat, dan kini siap berjanji seumur hidup. Kami sangat bahagia bisa berbagi momen istimewa ini bersama Anda."
    },
    {
      year: "2026",
      title: "Lamaran & Komitmen",
      description: "Setelah melalui perjalanan panjang, saling bertumbuh, dan memantapkan hati, dengan restu kedua keluarga besar kami mengikat janji suci pertunangan untuk melangkah ke jenjang pernikahan."
    },
    {
      year: "2026",
      title: "Pernikahan",
      description: "Hari yang penuh berkah dan doa. Kami mengucap ikrar suci akad nikah untuk menyempurnakan ibadah dan memulai lembaran baru sebagai sepasang suami istri di hadapan Allah SWT."
    }
  ],

  // Multimedia (Cloudinary CDN, YouTube Unlisted)
  multimedia: {
    // YouTube Unlisted Video (embed ID or URL)
    youtubeVideoId: "kJQP7kiw5Fk", // Replace with your unlisted YouTube Video ID
    
    // Background Audio (Lagu Pernikahan Kita / Wedding Instrumental)
    // You can host MP3 on Cloudinary or static folder
    backgroundMusic: "https://res.cloudinary.com/daiatjplq/video/upload/v1787052824/wijaya_xgcztu.mp3",
    audioFallback: "https://cdn.pixabay.com/download/audio/2022/02/22/audio_c0c978007a.mp3?filename=romantic-wedding-110091.mp3",
    songTitle: "KUSUMA WIJAYA",

    // Gallery Photos (Cloudinary CDN links with curated wedding aesthetics)
    gallery: [
      {
        id: 1,
        url: "https://res.cloudinary.com/daiatjplq/image/upload/v1787055914/WhatsApp_Image_2026-08-18_at_7.06.03_PjM_xlqk9u.jpg",
        thumb: "https://res.cloudinary.com/daiatjplq/image/upload/v1787055914/WhatsApp_Image_2026-08-18_at_7.06.03_PjM_xlqk9u.jpg",
        caption: "Momen Bahagia Habib & Adiba"
      },
      {
        id: 2,
        url: "https://res.cloudinary.com/daiatjplq/image/upload/v1787055915/WhatsApp_Image_2026-08-18_at_7.06.03_PM_u1hyrp.jpg",
        thumb: "https://res.cloudinary.com/daiatjplq/image/upload/v1787055915/WhatsApp_Image_2026-08-18_at_7.06.03_PM_u1hyrp.jpg",
        caption: "Janji Suci Dalam Cinta"
      },
      {
        id: 3,
        url: "https://res.cloudinary.com/daiatjplq/image/upload/v1787055916/WhatsApp_Image_2026-08-18_at_7.06.04_PMkkjh_sduoss.jpg",
        thumb: "https://res.cloudinary.com/daiatjplq/image/upload/v1787055916/WhatsApp_Image_2026-08-18_at_7.06.04_PMkkjh_sduoss.jpg",
        caption: "Menatap Masa Depan Bersama"
      },
      {
        id: 4,
        url: "https://res.cloudinary.com/daiatjplq/image/upload/v1787055916/WhatsApp_Image_2026-08-18_at_7.06.03_lkklPM_nov9xn.jpg",
        thumb: "https://res.cloudinary.com/daiatjplq/image/upload/v1787055916/WhatsApp_Image_2026-08-18_at_7.06.03_lkklPM_nov9xn.jpg",
        caption: "Langkah Awal Menuju Ridho-Nya"
      },
      {
        id: 5,
        url: "https://res.cloudinary.com/daiatjplq/image/upload/v1787055916/WhatsApp_Image_2026-08-18_at_7.06.04_PkhjkM_ren2fe.jpg",
        thumb: "https://res.cloudinary.com/daiatjplq/image/upload/v1787055916/WhatsApp_Image_2026-08-18_at_7.06.04_PkhjkM_ren2fe.jpg",
        caption: "Kebahagiaan Dalam Kesederhanaan"
      },
      {
        id: 6,
        url: "https://res.cloudinary.com/daiatjplq/image/upload/v1787055917/WhatsApp_Image_2026-08-18_at_7.06.04_PMfg_xbhv3f.jpg",
        thumb: "https://res.cloudinary.com/daiatjplq/image/upload/v1787055917/WhatsApp_Image_2026-08-18_at_7.06.04_PMfg_xbhv3f.jpg",
        caption: "Abadi Dalam Doa dan Cinta"
      }
    ]
  },

  // Digital Envelope & Gift
  gift: {
    bank: {
      bankName: "BCA",
      bankLogo: "BCA",
      accountNumber: "4561488414",
      accountHolder: "Edita Efendi"
    },
    bankBride: {
      bankName: "MANDIRI",
      bankLogo: "MANDIRI",
      accountNumber: "1370020747719",
      accountHolder: "Edita Efendi"
    },
    physicalGift: {
      recipient: "Edita Efendi",
      phone: "081234567890",
      address: "Sempu 0036/009, Pringombo Rongkop, Gunungkidul"
    }
  },

  // Supabase Database Settings (Reads dynamically from .env / js/env.js / Vercel Environment Variables)
  supabase: {
    get url() {
      if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.SUPABASE_URL) {
        return window.__ENV__.SUPABASE_URL.trim();
      }
      return "";
    },
    get anonKey() {
      if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.SUPABASE_ANON_KEY) {
        return window.__ENV__.SUPABASE_ANON_KEY.trim();
      }
      return "";
    }
  }
};
