export const getDisplacementFilter = ({
  height,
  width,
  radius,
  depth,
  strength,
  chromaticAberration,
}) => {
  const id = `glass-filter-${Math.random().toString(36).substr(2, 9)}`;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg">
      <filter id="${id}" x="0%" y="0%" width="100%" height="100%">
        
        <feTurbulence 
          type="fractalNoise" 
          baseFrequency="0.01 0.01" 
          numOctaves="2" 
          result="noise" 
        />
        
        <feDisplacementMap 
          in="SourceGraphic" 
          in2="noise" 
          scale="${depth * strength}" 
          xChannelSelector="R" 
          yChannelSelector="G"
        />

        ${
          chromaticAberration
            ? `
        <feOffset dx="${chromaticAberration}" dy="0" result="r"/>
        <feOffset dx="${-chromaticAberration}" dy="0" result="b"/>
        `
            : ""
        }

      </filter>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}#${id}`;
};