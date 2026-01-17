export async function GET() {
  const svg = `
    <svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
      <rect width="192" height="192" rx="32" fill="#2563eb"/>
      <text x="96" y="120" font-family="Arial, sans-serif" font-size="80" text-anchor="middle" fill="white">🎨</text>
    </svg>
  `;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000',
    },
  });
}
