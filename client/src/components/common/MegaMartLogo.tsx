import React from 'react';

interface MegaMartLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
  withTagline?: boolean;
}

export const MegaMartLogo: React.FC<MegaMartLogoProps> = ({
  className = '',
  size = 'md',
  theme = 'light',
  withTagline = true,
}) => {
  // Height scaling
  const height = size === 'sm' ? 34 : size === 'lg' ? 52 : 42;
  const isDark = theme === 'dark';
  const greenColor = isDark ? '#10B981' : '#047857';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        height={height}
        viewBox="0 0 240 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
        aria-label="Mega Mart"
      >
        <g id="real-megamart-brand-logo">
          {/* =========================================================
              1. THE "M" SLANTED SHOPPING CART WITH 3 COLORED STRIPES
             ========================================================= */}
          <g id="cart-bars">
            {/* Stripe 1: Red Bar (slanted forward ~14 deg) */}
            <path
              d="M10 4 H19 L12 33 H3 Z"
              fill="#DC2626"
              stroke="#DC2626"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Stripe 2: Orange Bar */}
            <path
              d="M23.5 4 H32.5 L25.5 33 H16.5 Z"
              fill="#EA580C"
              stroke="#EA580C"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Stripe 3: Green Bar */}
            <path
              d="M37 4 H46 L39 33 H30 Z"
              fill={greenColor}
              stroke={greenColor}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Wheel 1 (under Red bar) */}
            <circle cx="8" cy="40.5" r="5" fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" />
            <circle cx="8" cy="40.5" r="2" fill="#1E293B" />

            {/* Wheel 2 (under Orange bar) */}
            <circle cx="21.5" cy="40.5" r="5" fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" />
            <circle cx="21.5" cy="40.5" r="2" fill="#1E293B" />
          </g>

          {/* =========================================================
              2. "ega" TEXT (Completes "Mega" in matching green)
             ========================================================= */}
          <text
            x="52"
            y="32"
            fill={greenColor}
            fontFamily="'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontWeight="900"
            fontSize="32"
            letterSpacing="-0.5px"
          >
            ega
          </text>

          {/* =========================================================
              3. "Mart" TEXT (Bold green with capital 'M')
             ========================================================= */}
          <text
            x="118"
            y="32"
            fill={greenColor}
            fontFamily="'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontWeight="900"
            fontSize="32"
            letterSpacing="-0.5px"
          >
            Mart
          </text>

          {/* =========================================================
              4. REAL STOREFRONT SILVER PILL TAG BELOW "Mart"
             ========================================================= */}
          {withTagline && (
            <g id="silver-storefront-tag" transform="translate(118, 37)">
              {/* Capsule body inspired by the real storefront signboard */}
              <rect
                x="0"
                y="0"
                width="82"
                height="9.5"
                rx="4.75"
                fill={isDark ? '#CBD5E1' : '#E2E8F0'}
                stroke={isDark ? '#94A3B8' : '#CBD5E1'}
                strokeWidth="0.8"
              />
              <text
                x="41"
                y="7"
                fill="#334155"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                fontWeight="800"
                fontSize="6"
                letterSpacing="1.2px"
                textAnchor="middle"
              >
                SUPERMARKET
              </text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
