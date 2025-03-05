
import React, { useEffect } from 'react';

interface SidebarAdProps {
  adSlot: string;
  height?: string;
}

export function SidebarAd({ adSlot, height = '600px' }: SidebarAdProps) {
  useEffect(() => {
    // This would be replaced with actual AdMob initialization in production
    console.log(`Sidebar ad loaded: ${adSlot}`);
    
    // Simulate ad loading
    const adContainer = document.getElementById(`ad-sidebar-${adSlot}`);
    if (adContainer) {
      adContainer.innerHTML = `
        <div style="background-color: #f0f0f0; border: 1px dashed #ccc; text-align: center; padding: 10px; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column;">
          <div>
            <p>AD PLACEHOLDER</p>
            <p>AdMob vertical format</p>
            <p>Slot: ${adSlot}</p>
          </div>
        </div>
      `;
    }

    return () => {
      // Cleanup if needed
      const adContainer = document.getElementById(`ad-sidebar-${adSlot}`);
      if (adContainer) {
        adContainer.innerHTML = '';
      }
    };
  }, [adSlot]);

  return (
    <div 
      id={`ad-sidebar-${adSlot}`} 
      className="sidebar-ad"
      style={{ 
        width: '300px', 
        height, 
        position: 'sticky',
        top: '20px'
      }}
    ></div>
  );
}
