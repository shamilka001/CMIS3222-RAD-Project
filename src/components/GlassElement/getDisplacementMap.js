export const getDisplacementMap = ({
  height,
  width,
  radius,
  depth,
}) => {
  const svg = `
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="${width}" 
      height="${height}"
    >
      <defs>
        <radialGradient id="grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="white"/>
          <stop offset="100%" stop-color="black"/>
        </radialGradient>
      </defs>

      <rect 
        x="0" 
        y="0" 
        width="${width}" 
        height="${height}" 
        rx="${radius}" 
        ry="${radius}"
        fill="url(#grad)" 
      />
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};