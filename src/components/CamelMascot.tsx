import React from 'react';

export default function CamelMascot({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 100"
      className={className}
      {...props}
      fill="currentColor"
    >
      {/* Single-hump dromedary camel silhouette — Moroccan style */}
      <path d={[
        // Head: long flat snout, slightly drooping
        'M16,38', 'L8,40', 'L6,43', 'L8,46', 'L14,46',
        // Jaw up to neck
        'L18,44',
        // Neck — long, angled upward
        'L22,42', 'L30,28', 'L36,22',
        // Top of hump — single prominent hump
        'C42,12 56,8 66,10',
        'C74,12 80,18 82,26',
        // Back slopes down from hump
        'L88,34', 'L94,38', 'L98,40',
        // Tail
        'L102,36', 'L104,32', 'L103,34', 'L100,40',
        // Rump down to back legs
        'L98,48', 'L96,56',
        // Back right leg
        'L98,68', 'L99,76', 'L100,82', 'L96,82', 'L95,76', 'L93,68',
        // Between back legs
        'L90,60',
        // Back left leg
        'L88,68', 'L87,76', 'L88,82', 'L84,82', 'L83,76', 'L82,68',
        // Belly
        'L78,58', 'L60,60', 'L44,58',
        // Front right leg
        'L42,68', 'L41,76', 'L42,82', 'L38,82', 'L37,76', 'L36,68',
        // Between front legs
        'L34,58',
        // Front left leg
        'L32,68', 'L31,76', 'L32,82', 'L28,82', 'L27,76', 'L26,68',
        // Chest back up to head
        'L24,56', 'L22,48', 'L18,44',
        'Z',
      ].join(' ')} />
      {/* Eye */}
      <circle cx="13" cy="41" r="1.2" fill="currentColor" opacity="0.15" />
      {/* Ear */}
      <path d="M32,22 L29,16 L34,20" fill="currentColor" opacity="0.7" />
    </svg>
  );
}
