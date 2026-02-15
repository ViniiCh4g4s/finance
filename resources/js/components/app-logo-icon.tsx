import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="7" fill="#18181B" />
            <text x="16" y="22.5" textAnchor="middle" fontFamily="Inter, -apple-system, BlinkMacSystemFont, sans-serif" fontWeight="700" fontSize="20" fill="white">F</text>
        </svg>
    );
}
