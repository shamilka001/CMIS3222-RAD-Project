import { useState, useEffect } from "react";

// ==========================================================
// HIGH-PERFORMANCE HALFTONE PROCESSING ENGINE (HOOK)
// ==========================================================
function useHalftoneImage(imageUrl) {
  const [halftoneDataUrl, setHalftoneDataUrl] = useState("");

  useEffect(() => {
    if (!imageUrl) {
      setHalftoneDataUrl("");
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const targetWidth = 600;
      const scaleFactor = targetWidth / img.width;
      const targetHeight = img.height * scaleFactor;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      try {
        const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        const pixels = imgData.data;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.fillStyle = "#000000";

        const dotSpacing = 5;

        for (let y = 0; y < targetHeight; y += dotSpacing) {
          for (let x = 0; x < targetWidth; x += dotSpacing) {
            const index = (y * targetWidth + x) * 4;
            const r = pixels[index];
            const g = pixels[index + 1];
            const b = pixels[index + 2];
            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
            const darknessRatio = 1 - brightness / 255;

            if (darknessRatio > 0.05) {
              const maxRadius = dotSpacing * 0.7;
              const radius = maxRadius * darknessRatio;

              ctx.beginPath();
              ctx.arc(
                x + dotSpacing / 2,
                y + dotSpacing / 2,
                radius,
                0,
                Math.PI * 2
              );
              ctx.fill();
            }
          }
        }

        setHalftoneDataUrl(canvas.toDataURL("image/png"));
      } catch (error) {
        console.error(
          "Halftone computation failed: Falling back to standard image layout.",
          error
        );
        setHalftoneDataUrl(imageUrl);
      }
    };

    img.onerror = () => {
      console.error("Could not load image source framework.");
    };
  }, [imageUrl]);

  return halftoneDataUrl;
}

export default function Tickets({ selectedMovie, selectedShowtime, selectedSeats }) {
  const finalHalftoneCover = useHalftoneImage(selectedMovie?.poster_image);

  return (
    <div className="absolute inset-0 bg-white text-black min-h-screen w-full z-[999999] p-0 m-0 print-portal-root">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap"
        rel="stylesheet"
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @page { margin: 0; size: 115mm 297mm; }
        @media print {
          body * { visibility: hidden !important; }
          .print-portal-root, .print-portal-root * { visibility: visible !important; }
          .print-portal-root { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; height: 100% !important; background: #ffffff !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
        html, body { background: #ffffff !important; color: #000000 !important; overflow: visible !important; height: auto !important; margin: 0 !important; padding: 0 !important; }
        .ticket-page-break { page-break-after: always !important; break-after: page !important; display: flex !important; }
        .boarding-canvas, .boarding-canvas * { font-family: 'Share Tech Mono', monospace !important; text-transform: uppercase !important; box-sizing: border-box; letter-spacing: 0.02em; }
      `,
        }}
      />

      {selectedSeats.map((seat, index) => {
        const uniquePassToken = `ML-${selectedShowtime.showtime_id}-${seat.id}`;
        const currentDateStr = new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });

        return (
          <div
            key={seat.id}
            className="ticket-page-break bg-white text-black mx-auto select-none boarding-canvas flex-col items-stretch border-[2px] border-black"
            style={{
              width: "115mm",
              height: "297mm",
              backgroundColor: "#f2f2f2",
            }}
          >
            {/* Header / Halftone Poster */}
            <div className="h-[28%] bg-black text-white relative flex flex-col justify-between p-4 border-b-2 border-black overflow-hidden">
              {finalHalftoneCover && (
                <div className="absolute inset-0 z-0">
                  <img
                    src={finalHalftoneCover}
                    alt="Halftone Manifest"
                    className="w-full h-full object-cover mix-blend-lighten"
                    style={{ opacity: 0.85 }}
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 z-5" />
              <div className="relative z-10 flex justify-between items-center text-[11px] tracking-wider text-zinc-300 font-bold">
                <div>MAXLIGHT CINEMAS // FILMPASS</div>
                <div>
                  NO. {index + 1}/{selectedSeats.length}
                </div>
              </div>
              <div className="relative z-10 bg-black/80 p-2 border-l-4 border-white mt-auto">
                <h2 className="text-xl tracking-wide leading-none font-bold text-white">
                  {selectedMovie.film_name}
                </h2>
                <span className="text-[9px] text-zinc-400 block mt-1 tracking-widest">
                  ADMISSION FRAMEWORK DIRECTIVE
                </span>
              </div>
            </div>

            {/* Main Admission Info */}
            <div className="h-[44%] p-5 flex flex-col justify-between border-b-2 border-dashed border-zinc-400 relative">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-zinc-500 block">
                    THEATER VENUE
                  </span>
                  <span className="text-sm font-bold text-black">
                    {selectedShowtime.screen_name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 block">
                    CATALOG TOKEN
                  </span>
                  <span className="text-sm font-bold text-black">
                    {uniquePassToken}
                  </span>
                </div>
              </div>

              <div className="my-auto space-y-4">
                <div>
                  <span className="text-[10px] text-zinc-500 tracking-wider block">
                    ASSIGNED POSITION
                  </span>
                  <h1 className="text-6xl font-black tracking-tighter text-black leading-none">
                    {seat.id}
                  </h1>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 tracking-wider block">
                    SHOWTIME INITIATION
                  </span>
                  <h1 className="text-4xl font-black tracking-tight text-black leading-none">
                    {selectedShowtime.start_time}
                  </h1>
                </div>
              </div>

              <div className="flex justify-between items-end pt-2 border-t border-zinc-300">
                <div>
                  <span className="text-[10px] text-zinc-500 block">
                    VALIDATION DATE
                  </span>
                  <span className="text-sm font-bold text-black">
                    {currentDateStr}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 block">
                    TIER SCALE
                  </span>
                  <span className="text-sm font-bold text-black">
                    {seat.type}
                  </span>
                </div>
              </div>
            </div>

            {/* Tear-Off Stub */}
            <div className="h-[28%] p-5 flex flex-col justify-between bg-zinc-100/80">
              <div className="flex justify-between items-start">
                <div className="max-w-[70%]">
                  <span className="text-[9px] text-zinc-500 block">
                    FEATURE STUB
                  </span>
                  <h3 className="text-xs font-bold text-black truncate leading-tight">
                    {selectedMovie.film_name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-zinc-500 block">
                    PRICE DEBIT
                  </span>
                  <span className="text-xs font-bold text-black">
                    Rs. {seat.price.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="w-full flex flex-col items-center space-y-1">
                <div className="w-full h-10 bg-white border border-zinc-300 p-1 flex items-center justify-center overflow-hidden">
                  <div
                    className="w-full h-8 bg-repeat-x opacity-90"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, #000 0px, #000 2px, transparent 2px, transparent 4px, #000 4px, #000 5px, transparent 5px, transparent 7px, #000 7px, #000 10px)",
                    }}
                  />
                </div>
                <span className="text-[9px] font-mono text-zinc-500 tracking-widest">
                  {uniquePassToken}-{seat.id}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <div>
                  <span className="text-[9px] text-zinc-500 block">
                    SEAT ID
                  </span>
                  <span className="text-sm font-bold text-black">
                    {seat.id}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-zinc-500 block">
                    DEPARTS TIME
                  </span>
                  <span className="text-sm font-bold text-black">
                    {selectedShowtime.start_time}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}