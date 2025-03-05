import React, { useEffect } from "react";

interface AdBannerProps {
  adSlot: string;
  adFormat?: "auto" | "rectangle" | "horizontal" | "vertical";
  style?: React.CSSProperties;
}

export function AdBanner({ adSlot, adFormat = "auto", style }: AdBannerProps) {
  useEffect(() => {
    // This would be replaced with actual AdMob initialization in production
    console.log(`Ad banner loaded: ${adSlot}`);

    // Simulate ad loading
    const adContainer = document.getElementById(`ad-container-${adSlot}`);
    if (adContainer) {
      adContainer.innerHTML = `
        <div style="background-color: #f0f0f0; border: 1px dashed #ccc; text-align: center; padding: 10px; height: 100%; display: flex; align-items: center; justify-content: center;">
          <div>
            <p>AD PLACEHOLDER</p>
            <p>AdMob ${adFormat} format</p>
            <p>Slot: ${adSlot}</p>
          </div>
        </div>
      `;
    }

    return () => {
      // Cleanup if needed
      const adContainer = document.getElementById(`ad-container-${adSlot}`);
      if (adContainer) {
        adContainer.innerHTML = "";
      }
    };
  }, [adSlot, adFormat]);

  return (
    <div id={`ad-container-${adSlot}`} className="ad-container" style={style}></div>
  );
}
