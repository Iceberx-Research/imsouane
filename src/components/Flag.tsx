export default function Flag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" {...props}>
      <rect width="900" height="600" fill="#c1272d" />
      <path
        d="M450,150 L488,266.6 L610.1,266.6 L511.3,338.4 L549.1,455 L450,383 L350.9,455 L388.7,338.4 L289.9,266.6 L412,266.6 Z"
        fill="none"
        stroke="#006233"
        strokeWidth="15"
      />
    </svg>
  );
}
