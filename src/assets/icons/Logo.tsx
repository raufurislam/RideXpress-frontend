// export default function Logo() {
//   return (
//     <svg
//       id="logo-38"
//       width="78"
//       height="32"
//       viewBox="0 0 78 32"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       {" "}
//       <path
//         d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
//         className="ccustom"
//         fill="#FF7A00"
//       ></path>{" "}
//       <path
//         d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
//         className="ccompli1"
//         fill="#FF9736"
//       ></path>{" "}
//       <path
//         d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
//         className="ccompli2"
//         fill="#FFBC7D"
//       ></path>{" "}
//     </svg>
//   );
// }

type LogoProps = React.SVGProps<SVGSVGElement> & {
  size?: number; // optional size prop
  width?: number | string;
  height?: number | string;
};

export default function Logo({ size, width, height, ...props }: LogoProps) {
  // default normal size
  const defaultWidth = 78;
  const defaultHeight = 32;

  return (
    <svg
      width={size ?? width ?? defaultWidth}
      height={size ?? height ?? defaultHeight}
      viewBox="0 0 78 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
        className="ccustom"
        fill="#FF7A00"
      />
      <path
        d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
        className="ccompli1"
        fill="#FF9736"
      />
      <path
        d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
        className="ccompli2"
        fill="#FFBC7D"
      />
    </svg>
  );
}
