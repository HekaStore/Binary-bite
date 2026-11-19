const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createOgImage() {
  const width = 1200;
  const height = 630;

  // Convert real product photos to base64 for embedding in the SVG
  const getBase64 = (filePath) => {
    const data = fs.readFileSync(filePath);
    return `data:image/jpeg;base64,${data.toString('base64')}`;
  };

  const logoBase64 = getBase64(path.join(process.cwd(), 'public/images/logo.jpg'));
  const esGabinBase64 = getBase64(path.join(process.cwd(), 'public/images/products/es-gabin.jpg'));
  const susBuahBase64 = getBase64(path.join(process.cwd(), 'public/images/products/sus-buah.jpg'));
  const rollAbonBase64 = getBase64(path.join(process.cwd(), 'public/images/products/roll-abon.jpg'));

  const svgContent = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0284C7" />
        <stop offset="60%" stop-color="#0369A1" />
        <stop offset="100%" stop-color="#075985" />
      </linearGradient>

      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FDE047" />
        <stop offset="100%" stop-color="#F59E0B" />
      </linearGradient>

      <clipPath id="circleClip">
        <circle cx="48" cy="48" r="46" />
      </clipPath>

      <clipPath id="photoClip1">
        <rect x="0" y="0" width="220" height="200" rx="20" ry="20" />
      </clipPath>

      <clipPath id="photoClip2">
        <rect x="0" y="0" width="220" height="200" rx="20" ry="20" />
      </clipPath>

      <clipPath id="photoClip3">
        <rect x="0" y="0" width="460" height="200" rx="20" ry="20" />
      </clipPath>

      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.25" />
      </filter>
    </defs>

    <!-- Background -->
    <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

    <!-- Subtle Background Origami Accent Lines -->
    <path d="M 0,400 L 400,200 L 800,500 L 1200,300" stroke="#BAE6FD" stroke-width="1.5" stroke-dasharray="8 8" opacity="0.25" fill="none" />
    <path d="M 200,630 L 500,450 L 900,630" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="6 6" opacity="0.2" fill="none" />

    <!-- Left Column: Content Container -->
    <g transform="translate(70, 60)">
      <!-- Top Brand Row with Mascot Logo -->
      <g transform="translate(0, 0)">
        <circle cx="48" cy="48" r="48" fill="#FFFFFF" filter="url(#shadow)" />
        <g clip-path="url(#circleClip)">
          <image href="${logoBase64}" x="2" y="2" width="92" height="92" preserveAspectRatio="xMidYMid slice" />
        </g>
        <rect x="116" y="14" width="330" height="34" rx="17" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" />
        <text x="132" y="36" font-family="'Inter', -apple-system, sans-serif" font-size="12" font-weight="800" fill="#FFFFFF" letter-spacing="0.08em">STAND KELAS 12B • 27-29 NOV 2026</text>

        <rect x="116" y="54" width="220" height="24" rx="12" fill="#FFFFFF" />
        <text x="128" y="70" font-family="'Inter', -apple-system, sans-serif" font-size="11" font-weight="800" fill="#0284C7">📍 Lumajang Kota</text>
      </g>

      <!-- Main Heading: Brand Name -->
      <text x="0" y="180" font-family="'Poppins', -apple-system, sans-serif" font-size="68" font-weight="900" fill="#FFFFFF" letter-spacing="-0.03em">BINARY<tspan fill="#BAE6FD">.BITE</tspan></text>

      <!-- Tagline -->
      <text x="0" y="226" font-family="'Poppins', -apple-system, sans-serif" font-size="30" font-weight="800" fill="url(#goldGrad)" letter-spacing="-0.01em">One Bite, Endless Happiness!</text>

      <!-- Description / Value Proposition -->
      <text x="0" y="272" font-family="'Inter', -apple-system, sans-serif" font-size="17" font-weight="600" fill="#F0F9FF">
        Sajian aneka kue lezat, kudapan renyah, dan minuman segar
      </text>
      <text x="0" y="298" font-family="'Inter', -apple-system, sans-serif" font-size="15" font-weight="500" fill="#BAE6FD">
        Kue Lipat • Sus Buah • Roll Abon • Es Gabin • Es Capcin
      </text>

      <!-- Factual Value Cards (Equal bounds) -->
      <g transform="translate(0, 340)">
        <!-- Box 1: Harga -->
        <rect x="0" y="0" width="160" height="74" rx="16" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" />
        <text x="16" y="24" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#BAE6FD" text-transform="uppercase">HARGA HEMAT</text>
        <text x="16" y="54" font-family="'Poppins', sans-serif" font-size="19" font-weight="900" fill="#FFFFFF">3K - 9K</text>

        <!-- Box 2: Kuota -->
        <rect x="175" y="0" width="165" height="74" rx="16" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" />
        <text x="191" y="24" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#BAE6FD" text-transform="uppercase">KAPASITAS SEGAR</text>
        <text x="191" y="54" font-family="'Poppins', sans-serif" font-size="19" font-weight="900" fill="#FFFFFF">25 Porsi/Hari</text>

        <!-- Box 3: Buka Stand -->
        <rect x="355" y="0" width="175" height="74" rx="16" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" />
        <text x="371" y="24" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#BAE6FD" text-transform="uppercase">WAKTU BUKA</text>
        <text x="371" y="54" font-family="'Poppins', sans-serif" font-size="19" font-weight="900" fill="#FFFFFF">07:00 WIB</text>
      </g>

      <!-- Bottom Link Callout -->
      <g transform="translate(0, 445)">
        <rect x="0" y="0" width="530" height="50" rx="25" fill="#FFFFFF" filter="url(#shadow)" />
        <text x="24" y="31" font-family="'Inter', sans-serif" font-size="15" font-weight="800" fill="#0284C7">
          🌐 Pesan Online: <tspan font-weight="900" fill="#0369A1">binarybite.vercel.app</tspan>
        </text>
        <rect x="390" y="8" width="130" height="34" rx="17" fill="#0284C7" />
        <text x="415" y="30" font-family="'Inter', sans-serif" font-size="13" font-weight="800" fill="#FFFFFF">Pesan →</text>
      </g>
    </g>

    <!-- Right Column: Authentic Food Showcase Frame -->
    <g transform="translate(660, 60)" filter="url(#shadow)">
      <!-- Main White Container -->
      <rect x="0" y="0" width="480" height="510" rx="28" fill="#FFFFFF" />

      <!-- Top Title inside card -->
      <text x="24" y="38" font-family="'Poppins', sans-serif" font-size="15" font-weight="900" fill="#0F172A">
        MENU KULINER POPULER
      </text>
      <text x="350" y="38" font-family="'Inter', sans-serif" font-size="13" font-weight="800" fill="#F59E0B">
        ★ 4.9 Rating
      </text>

      <!-- Photo 1: Es Gabin (Top Left) -->
      <g transform="translate(20, 56)">
        <g clip-path="url(#photoClip1)">
          <image href="${esGabinBase64}" x="0" y="0" width="220" height="200" preserveAspectRatio="xMidYMid slice" />
        </g>
        <!-- Price overlay -->
        <rect x="10" y="10" width="95" height="26" rx="8" fill="#0284C7" />
        <text x="20" y="27" font-family="'Poppins', sans-serif" font-size="11" font-weight="800" fill="#FFFFFF">Es Gabin 9K</text>
      </g>

      <!-- Photo 2: Sus Buah (Top Right) -->
      <g transform="translate(248, 56)">
        <g clip-path="url(#photoClip2)">
          <image href="${susBuahBase64}" x="0" y="0" width="220" height="200" preserveAspectRatio="xMidYMid slice" />
        </g>
        <!-- Price overlay -->
        <rect x="10" y="10" width="95" height="26" rx="8" fill="#0284C7" />
        <text x="20" y="27" font-family="'Poppins', sans-serif" font-size="11" font-weight="800" fill="#FFFFFF">Sus Buah 4K</text>
      </g>

      <!-- Photo 3: Roll Abon (Bottom Wide) -->
      <g transform="translate(20, 268)">
        <g clip-path="url(#photoClip3)">
          <image href="${rollAbonBase64}" x="0" y="0" width="448" height="175" preserveAspectRatio="xMidYMid slice" />
        </g>
        <!-- Price overlay -->
        <rect x="10" y="10" width="105" height="26" rx="8" fill="#0284C7" />
        <text x="20" y="27" font-family="'Poppins', sans-serif" font-size="11" font-weight="800" fill="#FFFFFF">Roll Abon 4K</text>
      </g>

      <!-- Quality Guarantee Bar -->
      <g transform="translate(20, 458)">
        <rect x="0" y="0" width="448" height="38" rx="12" fill="#F0F9FF" stroke="#BAE6FD" stroke-width="1" />
        <text x="14" y="24" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#0369A1">
          ✓ 100% Olahan Segar Higienis Siswa Kelas 12B
        </text>
      </g>
    </g>
  </svg>
  `;

  // Render SVG to Buffer and convert to optimized JPEG and PNG
  const svgBuffer = Buffer.from(svgContent);

  const outputJpg = path.join(process.cwd(), 'public/images/og-image.jpg');
  const outputRootJpg = path.join(process.cwd(), 'public/og-image.jpg');
  const outputPng = path.join(process.cwd(), 'public/images/og-image.png');
  const outputRootPng = path.join(process.cwd(), 'public/og-image.png');

  // Generate JPEG with high quality and size under 300KB
  await sharp(svgBuffer)
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(outputJpg);

  fs.copyFileSync(outputJpg, outputRootJpg);

  // Generate PNG
  await sharp(svgBuffer)
    .png({ quality: 90 })
    .toFile(outputPng);

  fs.copyFileSync(outputPng, outputRootPng);

  const stats = fs.statSync(outputJpg);
  console.log(`Successfully generated OG images! Size: ${Math.round(stats.size / 1024)} KB`);
}

createOgImage().catch(console.error);
